import { Request, Response } from "express";

import ValidateUserCredentials from "../../lib/validate-user-credentials";
import Session from "../../lib/session";
import PasswordReset from "../../lib/password-reset";

import User from "../../database/models/user";

async function login(req: Request, res: Response) {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({ error: "Missing email or password" });
  }

  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res
      .status(401)
      .json({ error: `No user found for ${req.body.email}` });
  }

  if (
    (await new ValidateUserCredentials(
      user,
      req.body.password
    ).passwordIsValid()) === false
  ) {
    return res
      .status(401)
      .json({ error: "The password you entered is incorrect" });
  }

  try {
    const userSession = new Session({ user });

    return res.status(200).json({
      token: await userSession.generateToken(),
      currentUser: await userSession.currentUser(user.uuid),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function signUp(req: Request, res: Response) {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.first_name ||
    !req.body.last_name
  ) {
    return res
      .status(401)
      .json({ error: "Please enter all required attributes" });
  }

  const existingUser = await User.findOne({ where: { email: req.body.email } });

  if (existingUser) {
    if (
      (await new ValidateUserCredentials(
        existingUser,
        req.body.password
      ).passwordIsValid()) === true
    ) {
      const userSession = await new Session({ user: existingUser });

      return res.status(200).json({
        existingUser: true,
        token: await userSession.generateToken(),
        currentUser: await userSession.currentUser(existingUser.uuid),
      });
    }

    return res.status(401).json({
      error: `${req.body.email} already exists, but we couldn't login that account with the password you have provided.`,
    });
  }

  try {
    const user = await User.create({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    const userSession = await new Session({ user });

    return res.status(200).json({
      token: await userSession.generateToken(),
      currentUser: await userSession.currentUser(user.uuid),
    });
  } catch (error) {
    return res.status(401).json({ error });
  }
}

async function validateSession(req: Request, res: Response) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Missing attributes" });
  }

  const userSession = await new Session({ token: req.headers.authorization });
  const validToken = await userSession.validateToken();

  if (!validToken) {
    return res
      .status(401)
      .json({ error: "Sorry, that's the incorrect e-mail or password" });
  }

  return res.status(200).json({
    token: userSession.formattedToken,
    currentUser: await userSession.currentUser(),
  });
}

async function passwordReset(req: Request, res: Response) {
  if (!req.body.email) {
    return res.status(401).json({ error: "Please enter an e-mail" });
  }

  try {
    const reset = new PasswordReset(req.body.email).sendEmail();

    if (reset) {
      return res
        .status(201)
        .json(
          "Check your email for instructions to reset your password. Don't forget to check your spam folder, and un-spam filter us if we're in there. 😉"
        );
    }

    return res.status(500).json();
  } catch (e) {
    return res.status(500).json(e);
  }
}

export default { login, signUp, validateSession, passwordReset };
