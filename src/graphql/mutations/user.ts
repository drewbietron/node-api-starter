import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfigArgumentMap
} from "graphql";
import { ApolloError } from "apollo-server-core";

import User from "../../database/models/user";

export const updateUserArgs: GraphQLFieldConfigArgumentMap = {
  uuid: {
    type: new GraphQLNonNull(GraphQLID)
  },
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

export async function updateUser(args) {
  let properties = {};
  let user;
  Object.keys(args).forEach(k => {
    properties = { ...properties, [k]: args[k] };
  });

  try {
    user = await User.update(properties, {
      where: {
        uuid: args.uuid
      },
      returning: true
    });
  } catch (e) {
    throw new ApolloError(e, "500");
  }

  return user[1];
}

export async function createUser(args) {
  let user: User;

  try {
    user = await User.create(args);
  } catch (e) {
    throw new ApolloError(e, "500");
  }

  return [user];
}
