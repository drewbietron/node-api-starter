import Session from "../../../../src/lib/session";
import testApolloClient from "../../../apollo-server-mock";
import createUser from "../../../fabricators/user";

describe("session mutations", () => {
  const token = "123";
  let user;
  beforeAll(async () => {
    spyOn(Session.prototype, "generateToken").and.returnValue("123");

    user = await createUser({ password: "valid-password" });
  });

  describe("loginUser mutation", () => {
    describe("with valid credentials", () => {
      it("returns a session node", async () => {
        const LOGIN_USER = `
          mutation {
            loginUser(email: "${user.email}", password: "valid-password") {
              user {
                firstName
              }
              token
            }
          }
        `;

        const { mutate } = testApolloClient({
          req: { headers: { authorization: null } },
        });

        const m = await mutate({
          mutation: LOGIN_USER,
        });

        expect(m.data).toMatchObject({
          loginUser: {
            user: { firstName: user.firstName },
            token,
          },
        });
      });
    });

    describe("with invalid credentials", () => {
      it("returns an error", async () => {
        const LOGIN_USER = `
          mutation {
            loginUser(email: "${user.email}", password: "invalid-password") {
              user {
                firstName
              }
              token
            }
          }
        `;

        const { mutate } = testApolloClient({
          req: { headers: { authorization: null } },
        });

        const m = await mutate({
          mutation: LOGIN_USER,
        });

        expect(m.data).toMatchObject({
          loginUser: null,
        });

        expect(m.errors[0].message).toBe(
          "The password you entered is incorrect"
        );
      });
    });
  });

  describe("signUp mutation", () => {
    it("returns session node", async () => {
      const SIGNUP_USER = `
            mutation {
              signUpUser(email: "test@123.com", password: "valid-password", firstName: "Drew", lastName: "Templeton") {
                user {
                  firstName
                  lastName
                  email
                }
                token
              }
            }
          `;

      const { mutate } = testApolloClient({
        req: { headers: { authorization: null } },
      });

      const m = await mutate({
        mutation: SIGNUP_USER,
      });

      expect(m.data).toMatchObject({
        signUpUser: {
          user: {
            email: "test@123.com",
            firstName: "Drew",
            lastName: "Templeton",
          },
          token,
        },
      });
    });

    describe("user already exists", () => {
      let m;

      describe("with invalid credentials", () => {
        beforeAll(async () => {
          const SIGNUP_USER = `
            mutation {
              signUpUser(email: "${user.email}", password: "invalid-password", firstName: "Drew", lastName: "Templeton") {
                user {
                  firstName
                  lastName
                  email
                }
                token
              }
            }
          `;

          const { mutate } = testApolloClient({
            req: { headers: { authorization: null } },
          });

          m = await mutate({
            mutation: SIGNUP_USER,
          });
        });

        it("returns an error message if password does not match existing user", async () => {
          expect(m.errors[0].message).toBe(
            `${user.email} already exists, but we couldn't login that account with the password you have provided.`
          );
        });

        it("returns a 401", async () => {
          expect(m.errors[0].extensions.code).toBe("401");
        });

        it("does not return a user", async () => {
          expect(m.data).toMatchObject({
            signUpUser: null,
          });
        });
      });

      describe("with valid credentials", () => {
        beforeAll(async () => {
          const SIGNUP_USER = `
            mutation {
              signUpUser(email: "${user.email}", password: "valid-password", firstName: "Drew", lastName: "Templeton") {
                user {
                  firstName
                  lastName
                  email
                }
                token
              }
            }
          `;

          const { mutate } = testApolloClient({
            req: { headers: { authorization: null } },
          });

          m = await mutate({
            mutation: SIGNUP_USER,
          });
        });

        it("return a session node with the existing user information", async () => {
          expect(m.data).toMatchObject({
            signUpUser: {
              user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              },
              token,
            },
          });
        });
      });
    });
  });
});
