import { Router } from "express";

import authValidation from "../validations/auth";

import handleValidationError from "../middleware/handleValidationError";
import checkAuth from "../middleware/checkAuth";

import userControllers from "../controllers/UserController";

const router = Router();

// /api/auth/login
router.post(
  "/login",
  authValidation.loginValidation,
  handleValidationError,
  userControllers.login
);

// /api/auth/register
router.post(
  "/register",
  authValidation.registerValidation,
  handleValidationError,
  userControllers.register
);

//  /api/auth/ me;
router.get("/me", checkAuth, userControllers.getMe);

export default router;
