import { body } from "express-validator";

const loginValidation = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password should be min 5 symbols").isLength({ min: 5 }),
];

const registerValidation = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password should be min 5 symbols").isLength({ min: 5 }),
  body("fullName", "Enter name").isLength({ min: 3 }),
  body("avatarUrl", "Inccorect link for avatar").optional().isURL(),
];

export default { registerValidation, loginValidation };
