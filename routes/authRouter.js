import { Router } from "express";

import authControllers from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";

import {
  userSignUpSchema,
  userSignInSchema,
  userEmailSchema,
} from "../schemas/userSchemas.js";

import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const signUpMiddleware = validateBody(userSignUpSchema);
const signInMiddleware = validateBody(userSignInSchema);
const resendVerifyMiddleware = validateBody(userEmailSchema);

const authRouter = Router();

authRouter.post("/register", signUpMiddleware, authControllers.signUp);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  resendVerifyMiddleware,
  authControllers.resendVerify
);

authRouter.post("/login", signInMiddleware, authControllers.signIn);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signOut);

authRouter.patch("/", authenticate, authControllers.updateSubscription);

authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authControllers.updateAvatar
);

export default authRouter;
