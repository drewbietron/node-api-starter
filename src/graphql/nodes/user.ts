import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

export const user = new GraphQLObjectType({
  name: "User",
  description: "A user",
  fields: () => ({
    uuid: {
      type: GraphQLID
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString,
      description: "The first name of the user"
    },
    lastName: {
      type: GraphQLString,
      description: "The last name of the user"
    },
    email: {
      type: GraphQLString,
      description: "The email name of the user"
    }
  })
});

export default user;
