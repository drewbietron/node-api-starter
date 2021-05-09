import Session from "../../../src/lib/session";
import createUser from "../../fabricators/user";
import User from "../../../src/database/models/user";

describe("SessionToken", () => {
  describe("generateToken", () => {
    it("returns a jwt token", async () => {
      const user = await createUser();
      const token = await new Session({ user }).generateToken();
      expect(token).toBeDefined();
    });
  });

  describe("validateToken", () => {
    it("validates a jwt token", async () => {
      const user = await createUser();
      const token = await new Session({ user }).generateToken();
      const validToken = await new Session({ user, token }).validateToken();

      expect(validToken).not.toBeNull();
    });

    it("returns a session object with data, iat and expiration", async () => {
      const user = await createUser();
      const token = await new Session({ user }).generateToken();
      const validToken = await new Session({ user, token }).validateToken();

      expect(validToken).toHaveProperty("data");
      expect(validToken).toHaveProperty("iat");
      expect(validToken).toHaveProperty("exp");

      expect(validToken.data).not.toBeNull();
      expect(validToken.iat).not.toBeNull();
      expect(validToken.exp).not.toBeNull();
    });

    it("returns the user information", async () => {
      const user = await createUser();
      const token = await new Session({ user }).generateToken();
      const isValidToken = await new Session({ user, token }).validateToken();
      const returnedUser = await User.findByPk(isValidToken.data);

      expect(returnedUser.uuid).toBe(user.uuid);
    });
  });

  describe("currentUser", () => {
    it("returns the current user", async () => {
      const user = await createUser();
      const token = await new Session({ user }).generateToken();
      const currentUser = await new Session({ token }).currentUser();

      expect(user.uuid).toEqual(currentUser.uuid);
    });
  });
});
