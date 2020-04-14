import { GraphQLObjectType, GraphQLList, GraphQLSchema } from "graphql";

import User from "../database/models/user";

import user from "./nodes/user";

import defaultArgs from "./inputs/index";
import defaultResolver from "./resolvers/index";

import { userMutationArgs, mutateUser } from "./mutations/user";

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
      user: {
        type: new GraphQLList(user),
        args: userMutationArgs,
        resolve: (root, args, context, info) => mutateUser(args)
      }
    }
  }),
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      users: {
        type: new GraphQLList(user),
        args: defaultArgs,
        resolve: defaultResolver(User)
      },
      my: {
        type: user,
        resolve: (root, args, context, info) => context.user
      }
    }
  })
});

export default schema;
