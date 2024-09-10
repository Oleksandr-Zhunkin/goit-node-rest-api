import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Jimp } from "jimp";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const avatarsPath = path.resolve("public", "avatars");

const signUp = async (req, res) => {
  const newUser = await authServices.signUp(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  await authServices.verifyUser(verificationToken);

  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  await authServices.resendVerifyEmail(email);

  res.json({
    message: "Verification email sent",
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);

  Jimp.read(newPath, (error, img) => {
    if (error) throw HttpError(500, err);
    img.resize(250, 250).write(newPath);
  });

  const avatarURL = path.join("avatars", filename);

  await authServices.updateUser({ _id }, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signUp: ctrlWrapper(signUp),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
