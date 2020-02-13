import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfigArgumentMap
} from "graphql";

export const defaultLimit = 50;

const defaultArgs: GraphQLFieldConfigArgumentMap = {
  // A lot of models inherit this input,
  // Set up a sane limit for associated records.
  limit: {
    type: GraphQLInt,
    defaultValue: defaultLimit
  },
  offset: {
    type: GraphQLInt
  },
  order: {
    type: GraphQLString
  },
  uuid: {
    type: new GraphQLList(new GraphQLNonNull(GraphQLID))
  }
};

export default defaultArgs;
