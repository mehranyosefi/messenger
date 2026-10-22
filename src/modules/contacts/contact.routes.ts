import { Router } from "express";

import ContactController from "./contact.controller";
import {
  createContactSchema,
  updateContactSchema,
} from "./contact.validations";

import protect from "../../middleware/protectMiddleware";
import catchAsync from "../../utils/catchAsync";
import { validate } from "../../utils/middleware/validate.middleware";
// import { catchAsync } from "../../common/utils/catchAsync";

const router = Router();
const contactController = new ContactController();

router.use(protect);

router.get("/", catchAsync(contactController.getAll));

router.post(
  "/",
  //   validate(createContactSchema),
  catchAsync(contactController.create),
);

router.get("/:id", catchAsync(contactController.getOne));

router.patch(
  "/:id",
  validate(updateContactSchema),
  catchAsync(contactController.update),
);

router.delete("/:id", catchAsync(contactController.delete));

export default router;
