import * as authServices from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const signUp = async (req, res) => {
  const newUser = await authServices.signUp(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signIn = async (req, res) => {
  const { token } = await authServices.signIn(req.body);

  res.json({
    token,
  });
};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
};
