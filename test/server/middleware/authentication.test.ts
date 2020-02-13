import { Request } from "jest-express/lib/request";
import { Response } from "jest-express/lib/response";
import createUser from "../../fabricators/user";
import Session from "../../../src/server/middleware/session";

import Authentication, {
  authenticatedPaths
} from "../../../src/server/middleware/authentication";

describe("authentication middleware", () => {
  function mockResponse(): any {
    return new Response();
  }

  function mockRequest(route = "/", overrides): any {
    return new Request(route, { ...overrides });
  }

  describe("with a valid token", () => {
    it("sets res.locals.session to the user session", async () => {
      const user = await createUser();
      const token = await new Session({ user }).generateToken();
      const req = mockRequest("/", {
        headers: { authorization: token }
      });
      const res = mockResponse();
      const next = jest.fn();

      new Authentication({ req, res, next }).authenticate();
      expect(res.locals.session).toEqual(new Session({ token }));
    });

    describe("auth paths", () => {
      it("returns early if its not an auth path", async () => {
        return authenticatedPaths.forEach(() => {
          const req = mockRequest("/_health", {
            headers: { authorization: null }
          });
          const res = mockResponse();
          const next = jest.fn();

          new Authentication({ req, res, next }).authenticate();
          expect(next).toHaveBeenCalled();
        });
      });

      it("only cares about authenticating the auth paths", async () => {
        const user = await createUser();
        const token = await new Session({ user }).generateToken();

        return authenticatedPaths.forEach(() => {
          const req = mockRequest("/", {
            headers: { authorization: token }
          });
          const res = mockResponse();
          const next = jest.fn();

          new Authentication({ req, res, next }).authenticate();
          expect(next).toHaveBeenCalled();
        });
      });
    });
  });

  describe("with an invalid token", () => {
    it("sets res.locals.session to the user session", async () => {
      const req = mockRequest("/authenticated", {
        headers: { authorization: null }
      });
      const res = mockResponse();
      const next = jest.fn();

      new Authentication({ req, res, next }).authenticate();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("only cares about authenticating the auth paths", async () => {
      return authenticatedPaths.forEach(() => {
        const req = mockRequest("/authenticated", {
          headers: { authorization: null }
        });
        const res = mockResponse();
        const next = jest.fn();

        new Authentication({ req, res, next }).authenticate();
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });
});
