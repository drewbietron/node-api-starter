import request from "supertest";
import sendgrid from "@sendgrid/mail";
import * as faker from "faker";
import app from "../../../../src/server/config";
import createUser from "../../../fabricators/user";
import Session from "../../../../src/lib/session";

describe("/session endpoint", () => {
  describe("login", () => {
    describe("with valid credentials", () => {
      it("returns a 200", async () => {
        const user = await createUser({ password: "valid-password" });
        const validCredentials = {
          email: user.email,
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/login")
          .send(validCredentials);

        expect(response.status).toBe(200);
      });

      it("returns a jwt token for the user", async () => {
        const user = await createUser({ password: "valid-password" });
        const validCredentials = {
          email: user.email,
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/login")
          .send(validCredentials);

        expect(response.body.token.length).toBeDefined();
      });

      it("returns the current user", async () => {
        const user = await createUser({ password: "valid-password" });
        const validCredentials = {
          email: user.email,
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/login")
          .send(validCredentials);

        expect(response.body.currentUser.uuid).toBe(user.uuid);
      });
    });

    describe("with invalid credentials", () => {
      it("returns a 401 if the password does not match", async () => {
        const user = await createUser({ password: "valid-password" });
        const invalidCredentials = {
          email: user.email,
          password: "invalid-password",
        };

        const response = await request(app)
          .post("/session/login")
          .send(invalidCredentials);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe(
          "The password you entered is incorrect"
        );
      });

      it("returns a 401 if no user is found", async () => {
        const invalidCredentials = {
          email: "notfound@notfound.com",
          password: "invalid-password",
        };

        const response = await request(app)
          .post("/session/login")
          .send(invalidCredentials);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe(
          "No user found for notfound@notfound.com"
        );
      });

      it("returns a 401 if no email or username is supplied", async () => {
        const response = await request(app)
          .post("/session/login")
          .send();

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Missing email or password");
      });
    });
  });

  describe("signUp", () => {
    describe("with valid credentials", () => {
      it("returns a 200", async () => {
        const validCredentials = {
          first_name: "Bobby",
          last_name: "Brown",
          email: faker.internet.email(),
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/signup")
          .send(validCredentials);

        expect(response.status).toBe(200);
      });

      it("returns a jwt token for the user", async () => {
        const validCredentials = {
          first_name: "Bobby",
          last_name: "Brown",
          email: faker.internet.email(),
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/signup")
          .send(validCredentials);

        expect(response.body.token).toBeDefined();
      });
    });

    describe("user already exists", () => {
      it("returns an error message if password does not match existing user", async () => {
        const user = await createUser({ password: "invalid-password" });
        const existingUserCredentials = {
          first_name: "Bobby",
          last_name: "Brown",
          email: user.email,
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/signup")
          .send(existingUserCredentials);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe(
          `${user.email} already exists, but we couldn't login that account with the password you have provided.`
        );
      });

      it("returns a token if the email and password match an existing user", async () => {
        const user = await createUser({ password: "valid-password" });
        const existingUserCredentials = {
          first_name: "Bobby",
          last_name: "Brown",
          email: user.email,
          password: "valid-password",
        };

        const response = await request(app)
          .post("/session/signup")
          .send(existingUserCredentials);

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
      });
    });
  });

  describe("validateSession", () => {
    describe("with valid token", () => {
      it("returns a 200", async () => {
        const user = await createUser();
        const userSession = await new Session({ user });
        const token = await userSession.generateToken();

        const response = await request(app)
          .get("/session/validate")
          .set("Authorization", token);

        expect(response.status).toBe(200);
      });
    });

    describe("with invalid token", () => {
      it("returns a 401", async () => {
        const response = await request(app)
          .get("/session/validate")
          .set("Authorization", "foozy");

        expect(response.status).toBe(401);
      });
    });
  });

  describe("passwordReset", () => {
    describe("with valid email", () => {
      beforeEach(() => {
        spyOn(sendgrid, "send").and.returnValue(Promise.resolve({}));
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it("returns a 201", async () => {
        const user = await createUser();

        const response = await request(app)
          .post("/session/password-reset")
          .send({ email: user.email });

        expect(response.status).toBe(201);
        expect(response.body).toBe(
          "Check your email for instructions to reset your password. Don't forget to check your spam folder, and un-spam filter us if we're in there. 😉"
        );
      });
    });

    describe("with no email", () => {
      it("returns a 401", async () => {
        const response = await request(app).post("/session/password-reset");

        expect(response.status).toBe(401);
      });
    });
  });
});
