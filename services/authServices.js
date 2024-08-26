import bcrypt from "bcrypt";

import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";

import { createToken } from "../helpers/jwt.js";

const findUser = (filter) => User.findOne(filter);

export const signUp = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const signIn = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Passward invalid");
  }

  const payload = {
    id: user._id,
  };
  const token = createToken(payload);

  return { token };
};