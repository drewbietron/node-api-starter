import ValidateUserCredentials from "../../../src/lib/validate-user-credentials";
import createUser from "../../fabricators/user";

describe("ValidateUserCredentials", () => {
  describe("passwordIsValid", () => {
    it("returns true if the password is valid", async () => {
      const user = await createUser({ password: "valid-password" });
      const passwordIsValid = await new ValidateUserCredentials(
        user,
        "valid-password"
      ).passwordIsValid();

      expect(passwordIsValid).toBe(true);
    });

    it("returns false if the password is invalid", async () => {
      const user = await createUser({ password: "valid-password" });
      const passwordIsValid = await new ValidateUserCredentials(
        user,
        "invalid-password"
      ).passwordIsValid();

      expect(passwordIsValid).toBe(false);
    });

    it("throws an error if there is no password", async () => {
      const user = await createUser();
      try {
        await new ValidateUserCredentials(user, null).passwordIsValid();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
