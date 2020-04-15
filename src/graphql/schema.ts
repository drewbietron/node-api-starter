import { GraphQLObjectType, GraphQLList, GraphQLSchema } from "graphql";

import User from "../database/models/user";

import user from "./nodes/user";

import defaultArgs from "./inputs/index";
import defaultResolver from "./resolvers/index";

import {
  createUserArgs,
  createUser,
  updateUserArgs,
  updateUser
} from "./mutations/user";

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
      createUser: {
        type: new GraphQLList(user),
        args: createUserArgs,
        resolve: (root, args) => createUser(args)
      },
      updateUser: {
        type: new GraphQLList(user),
        args: updateUserArgs,
        resolve: (root, args) => updateUser(args)
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
