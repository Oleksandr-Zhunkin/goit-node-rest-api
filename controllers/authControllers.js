import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

const signUp = async (req, res) => {
  const newUser = await authServices.signUp(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signIn = async (req, res) => {
  const { token, user } = await authServices.signIn(req.body);

  res.json({
    token,
    user,
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;

  await authServices.updateUser({ _id }, { token: null });
  res.sendStatus(204);
};

const updateSubscription = async (req, res) => {
  const { _id, email } = req.user;

  const { subscription } = req.body;

  await authServices.updateUser({ _id }, { subscription });

  res.json({
    email,
    subscription,
  });
};
export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  updateSubscription: ctrlWrapper(updateSubscription),
};
