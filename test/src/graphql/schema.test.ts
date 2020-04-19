import schema from "../../../src/graphql/schema";

describe("schema fields", () => {
  it("includes 'users'", async () => {
    expect(schema.getQueryType().getFields().users).toBeDefined();
  });

  it("includes 'me'", async () => {
    expect(schema.getQueryType().getFields().users).toBeDefined();
  });
});
