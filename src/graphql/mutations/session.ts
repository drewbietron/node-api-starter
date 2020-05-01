import {
  GraphQLString,
  GraphQLFieldConfigArgumentMap,
  GraphQLNonNull,
} from "graphql";
import { ApolloError } from "apollo-server-core";

import User from "../../database/models/user";
import ValidateUserCredentials from "../../lib/validate-user-credentials";
import Session from "../../lib/session";
import PasswordReset from "../../lib/password-reset";

export const loginUserArgs: GraphQLFieldConfigArgumentMap = {
  email: {
    type: new GraphQLNonNull(GraphQLString),
  },
  password: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

export const signUpUserArgs: GraphQLFieldConfigArgumentMap = {
  firstName: {
    type: new GraphQLNonNull(GraphQLString),
  },
  lastName: {
    type: new GraphQLNonNull(GraphQLString),
  },
  email: {
    type: new GraphQLNonNull(GraphQLString),
  },
  password: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

export const resetUserPasswordArgs: GraphQLFieldConfigArgumentMap = {
  email: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

export async function loginUser(args) {
  const user = await User.findOne({ where: { email: args.email } });
  if (!user) {
    throw new ApolloError(`No user found for ${args.email}`, "401");
  }
  if (
    (await new ValidateUserCredentials(
      user,
      args.password
    ).passwordIsValid()) === false
  ) {
    throw new ApolloError("The password you entered is incorrect", "401");
  }

  try {
    const userSession = new Session({ user });
    const token = await userSession.generateToken();
    const currentUser = await userSession.currentUser(user.uuid);

    return {
      token,
      user: currentUser,
    };
  } catch (e) {
    throw new ApolloError(e, "500");
  }
}

export async function signUpUser(args) {
  const existingUser = await User.findOne({ where: { email: args.email } });

  if (existingUser) {
    if (
      (await new ValidateUserCredentials(
        existingUser,
        args.password
      ).passwordIsValid()) === true
    ) {
      const userSession = await new Session({ user: existingUser });
      const token = await userSession.generateToken();
      const currentUser = await userSession.currentUser(existingUser.uuid);

      return {
        token,
        user: currentUser,
      };
    }

    throw new ApolloError(
      `${args.email} already exists, but we couldn't login that account with the password you have provided.`,
      "401"
    );
  }

  try {
    const user = await User.create({
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: args.password,
    });

    const userSession = await new Session({ user });
    const token = await userSession.generateToken();
    const currentUser = await userSession.currentUser(user.uuid);

    return {
      token,
      user: currentUser,
    };
  } catch (e) {
    throw new ApolloError(e, "401");
  }
}

export async function resetUserPassword(args) {
  try {
    await new PasswordReset(args.email).sendEmail();

    return {
      status: "sent",
    };
  } catch (e) {
    throw new ApolloError(e, "500");
  }
}
