import createUser from "../../../fabricators/user";
import testApolloClient from "../../../apollo-server-mock";

describe("users", () => {
  let userOne;
  let userTwo;
  beforeAll(async () => {
    userOne = await createUser();
    userTwo = await createUser();
  });

  it("returns a user", async () => {
    const { query } = testApolloClient();
    const USERS = `
      query {
        users(uuid: ["${userOne.uuid}", "${userTwo.uuid}"]) {
          firstName
          uuid
        }
      }
    `;

    const q = await query({
      query: USERS,
    });

    q.data.users.forEach((u) => {
      expect(u).toMatchObject({ firstName: u.firstName, uuid: u.uuid });
    });
  });
});
