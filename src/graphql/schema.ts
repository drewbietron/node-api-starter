import { GraphQLObjectType, GraphQLList, GraphQLSchema } from "graphql";

import User from "../database/models/user";

import user from "./nodes/user";
import statusResponse from "./nodes/statusResponse";

import defaultArgs from "./inputs/index";
import defaultResolver from "./resolvers/index";

import { updateUserArgs, updateUser } from "./mutations/user";
import {
  loginUserArgs,
  loginUser,
  signUpUserArgs,
  signUpUser,
  resetUserPasswordArgs,
  resetUserPassword,
} from "./mutations/session";
import { session } from "./nodes/session";
import withCurrentUser from "./resolvers/authenticated";

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
      updateUser: {
        type: user,
        args: updateUserArgs,
        resolve: (root, args, context) =>
          withCurrentUser(context).then((u) => {
            return updateUser(args, u);
          }),
      },
      loginUser: {
        type: session,
        args: loginUserArgs,
        resolve: (root, args) => loginUser(args),
      },
      signUpUser: {
        type: session,
        args: signUpUserArgs,
        resolve: (root, args) => signUpUser(args),
      },
      resetUserPassword: {
        type: statusResponse,
        args: resetUserPasswordArgs,
        resolve: (root, args) => resetUserPassword(args),
      },
    },
  }),
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      users: {
        type: new GraphQLList(user),
        args: defaultArgs,
        resolve: defaultResolver(User),
      },
      me: {
        type: user,
        resolve: (root, args, context) =>
          withCurrentUser(context).then((u) => {
            return u;
          }),
      },
    },
  }),
});

export default schema;
