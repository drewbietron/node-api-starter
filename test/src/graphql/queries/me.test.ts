import createUser from "../../../fabricators/user";
import testApolloClient from "../../../apollo-server-mock";
import Session from "../../../../src/lib/session";

const ME = `
  query {
    me {
      firstName
    }
  }
`;

describe("me", () => {
  let token;
  let user;
  beforeAll(async () => {
    user = await createUser();
    token = await new Session({ user }).generateToken();
  });

  it("returns a user", async () => {
    const { query } = testApolloClient({
      req: { headers: { authorization: `Bearer ${token}` } },
    });

    const q = await query({
      query: ME,
    });

    expect(q.data).toMatchObject({ me: { firstName: user.firstName } });
  });
});
