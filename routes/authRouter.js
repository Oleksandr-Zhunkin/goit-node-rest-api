import { Router } from "express";

import authControllers from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";

import { userSignUpSchema, userSignInSchema } from "../schemas/userSchemas.js";

import authenticate from "../middlewares/authenticate.js";

const signUpMiddleware = validateBody(userSignUpSchema);
const signInMiddleware = validateBody(userSignInSchema);

const authRouter = Router();

authRouter.post("/register", signUpMiddleware, authControllers.signUp);

authRouter.post("/login", signInMiddleware, authControllers.signIn);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signOut);

export default authRouter;
