import { GraphQLObjectType, GraphQLString } from "graphql";

import user from "./user";

export const session = new GraphQLObjectType({
  name: "Session",
  description: "Session information for a user",
  fields: () => ({
    token: {
      type: GraphQLString
    },
    user: {
      type: user
    }
  })
});

export default user;
