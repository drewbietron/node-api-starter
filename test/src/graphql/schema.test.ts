// import { mockServer } from "graphql-tools";

// import {  addMockFunctionsToSchema } from "graphql-tools";
import { graphql } from "graphql";
import schema from "../../../src/graphql/schema";
import createUser from "../../fabricators/user";

// Fill this in with the schema string
// const schemaString = `
//   type Todo { id: ID, text: String, completed: Boolean }
//   type User { id: ID, name: String }
//   type Query { todoItems: [Todo] }
//   # ... other types here
// `;

// Make a GraphQL schema with no resolvers
// const schema = makeExecutableSchema(appSchema);

// Add mocks, modifies schema in place
// addMockFunctionsToSchema({ schema });

// async function user() {
//   await createUser();
// }

// schema: GraphQLSchema,
//   source: Source | string,
//   rootValue?: any,
//   contextValue?: any,
//   variableValues?: Maybe<{ [key: string]: any }>,
//   operationName?: Maybe<string>,
//   fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
//   typeResolver?: Maybe<GraphQLTypeResolver<any, any>>,

describe("testing", () => {
  it("has a social channel", async () => {
    const user = await createUser();
    const query = `{
      users(uuid: ${user.uuid}) { firstName }
    }`;

    async function runSchema() {
      return graphql(schema, query, { foozy: 1 });
    }

    expect(runSchema().then((r) => r)).toBe({ hey: 1 });
  });
});

// const myMockServer = mockServer(schema, {});
// async function queryServer() {
//   return myMockServer.query(`{
//     users: {
//       id
//       name
//     }
//     }`);
// }
// describe("A user", () => {
//   //   beforeAll(() => {
//   //     self.test = tester({
//   //       url: `http://127.0.0.1:${process.env.APP_PORT}/${process.env.GQL_ENDPOINT}`,
//   //       contentType: "application/json",
//   //     });
//   //   });

//   it("does a thing", () => {
//     expect(queryServer()).toBe({});
//   });
// });
// describe("A user", async () => {
//   console.log(process.env.PORT);
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const self = this;
//   beforeAll(() => {
//     self.test = tester({
//       url: `http://127.0.0.1:${process.env.APP_PORT}/${process.env.GQL_ENDPOINT}`,
//       contentType: "application/json",
//     });
//   });

//   let resp: any;

//   try {
//     resp = await self.test(
//       JSON.stringify({
//         query: `mutation register($username: String!, $password: String!) {
// register(username: $username, password: $password) {
// username
// message
// id
// }
// }`,
//         variables: {
//           username: "test",
//           password: "test",
//         },
//       })
//     );
//   } catch (e) {
//     console.log();
//   }

//   //   it("should register a new user", (done) => {
//   //     self
//   //       .test(
//   //         JSON.stringify({
//   //           query: `mutation register($username: String!, $password: String!) {
//   //   register(username: $username, password: $password) {
//   //     username
//   //     message
//   //     id
//   //   }
//   // }`,
//   //           variables: {
//   //             username: "test",
//   //             password: "test",
//   //           },
//   //         })
//   //       )
//   expect(resp.status).toBe(200);
//   // resp.status.
//   //       .then((res) => {
//   //         self.tempID = res.data.register.id; // adding userid to the test suite object
//   //         expect(res.status).toBe(200);
//   //         expect(res.success).toBe(true);
//   //         done();
//   //       })
//   //       .catch((err) => {
//   //         expect(err).toBe(null);
//   //         done();
//   //       });
//   //   });
// });
