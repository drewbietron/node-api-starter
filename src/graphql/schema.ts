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
import {
  loginUserArgs,
  loginUser,
  signUpUserArgs,
  signUpUser
} from "./mutations/session";
import { session } from "./nodes/session";

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
      createUser: {
        type: user,
        args: createUserArgs,
        resolve: (root, args) => createUser(args)
      },
      updateUser: {
        type: user,
        args: updateUserArgs,
        resolve: (root, args, context) => updateUser(args, context.user)
      },
      loginUser: {
        type: session,
        args: loginUserArgs,
        resolve: (root, args) => loginUser(args)
      },
      signUpUser: {
        type: session,
        args: signUpUserArgs,
        resolve: (root, args) => signUpUser(args)
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
      me: {
        type: user,
        resolve: (root, args, context) => context.user
      }
    }
  })
});

export default schema;
