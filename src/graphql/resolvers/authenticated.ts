import { ApolloError } from "apollo-server-core";
import Session from "../../lib/session";

export default async function withCurrentUser(context) {
  const user = await new Session({
    token: context.headers.authorization,
  }).currentUser();

  if (!user || !Object.keys(user).length) {
    throw new ApolloError("Please login", "401");
  }

  return user;
}
