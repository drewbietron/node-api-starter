import { GraphQLString, GraphQLFieldConfigArgumentMap } from "graphql";
import { ApolloError } from "apollo-server-core";

import User from "../../database/models/user";

export const updateUserArgs: GraphQLFieldConfigArgumentMap = {
  firstName: {
    type: GraphQLString
  },
  lastName: {
    type: GraphQLString
  },
  email: {
    type: GraphQLString
  }
};

export const createUserArgs: GraphQLFieldConfigArgumentMap = {
  firstName: {
    type: GraphQLString
  },
  lastName: {
    type: GraphQLString
  },
  email: {
    type: GraphQLString
  },
  password: {
    type: GraphQLString
  }
};

export async function updateUser(args, user) {
  let properties = {};
  Object.keys(args).forEach(k => {
    properties = { ...properties, [k]: args[k] };
  });

  try {
    await user.update(properties, {
      where: {
        uuid: args.uuid
      },
      returning: true
    });
  } catch (e) {
    throw new ApolloError(e, "500");
  }

  return user;
}

export async function createUser(args) {
  let user: User;

  try {
    user = await User.create(args);
  } catch (e) {
    throw new ApolloError(e, "500");
  }

  return user;
}
