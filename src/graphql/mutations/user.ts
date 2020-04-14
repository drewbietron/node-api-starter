import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfigArgumentMap
} from "graphql";
import { ApolloError } from "apollo-server-core";

import User from "../../database/models/user";

export const userMutationArgs: GraphQLFieldConfigArgumentMap = {
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

export async function mutateUser(args) {
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
