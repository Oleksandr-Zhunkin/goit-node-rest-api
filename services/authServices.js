import bcrypt from "bcrypt";
import gravatar from "gravatar";

import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";

import { createToken } from "../helpers/jwt.js";

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

  const newUser = User.create({
    ...data,
    password: hashPassword,
    avatarURL: url,
  });

  return newUser;
};

export const signIn = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
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
