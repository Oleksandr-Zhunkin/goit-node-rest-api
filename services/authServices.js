import bcrypt from "bcrypt";
import gravatar from "gravatar";

import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";

import { createToken } from "../helpers/jwt.js";
import { nanoid } from "nanoid";
import "dotenv/config";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
});

export const findUser = (filter) => User.findOne(filter);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const signUp = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const url = gravatar.url(email);

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...data,
    password: hashPassword,
    avatarURL: url,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail(email, verificationToken);

  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );
};

export const resendVerifyEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
};

export const signIn = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Password invalid");
  }

  const payload = {
    id: user._id,
  };
  const token = createToken(payload);

  await updateUser({ _id: user._id }, { token });

  return { token, user: { email, password } };
};
