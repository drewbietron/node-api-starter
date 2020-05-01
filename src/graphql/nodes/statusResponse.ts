import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLNonNull,
} from "graphql";

export const EmailResponseStatus = new GraphQLEnumType({
  name: "EmailResponseStatusEnum",
  values: {
    SENT: {
      value: "sent",
    },
  },
});

export const emailResponseStatus = new GraphQLObjectType({
  name: "emailResponseStatus",
  description: "A response after attempting to send an email",
  fields: () => ({
    status: {
      type: GraphQLNonNull(EmailResponseStatus),
    },
    success: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
  }),
});

export default emailResponseStatus;
