import { body } from "express-validator";

const postCreateValidation = [
  body("title", "Enter title of post").isLength({ min: 3 }).isString(),
  body("text", "Enter text of post").isLength({ min: 3 }).isString(),
  body("tags", "Incorrect format tags").optional().isArray(),
  body("imageUrl", "Inccorect link for image").optional().isString(),
];

export default { postCreateValidation };
