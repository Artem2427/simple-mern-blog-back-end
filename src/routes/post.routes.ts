import { Router } from "express";

import checkAuth from "../middleware/checkAuth";
import handleValidationError from "../middleware/handleValidationError";

import postValidation from "../validations/post";

import postControllers from "../controllers/PostController";

const router = Router();

router.get("/", postControllers.getAll);
router.get("/:id", postControllers.getOne);
router.post(
  "/",
  checkAuth,
  postValidation.postCreateValidation,
  handleValidationError,
  postControllers.create
);
router.delete("/:id", checkAuth, postControllers.remove);
router.patch(
  "/:id",
  checkAuth,
  postValidation.postCreateValidation,
  handleValidationError,
  postControllers.update
);
router.get("/tags/limit", postControllers.getLastTags);

export default router;
