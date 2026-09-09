import { Router } from "express";

import { contactController } from "./contact.controller";
import {
  createContactSchema,
  updateContactSchema,
} from "./contact.validation";

import protect from "../../middleware/protectMiddleware";
import catchAsync from "../../utils/catchAsync";
// import { validate } from "../../common/middleware/validate.middleware";
// import { catchAsync } from "../../common/utils/catchAsync";

const router = Router();

router.use(protect);

router.get(
  "/",
  catchAsync(contactController.getAll)
);

router.post(
  "/",
//   validate(createContactSchema),
  catchAsync(contactController.create)
);

router.get(
  "/:id",
  catchAsync(contactController.getOne)
);

router.patch(
  "/:id",
//   validate(updateContactSchema),
  catchAsync(contactController.update)
);

router.delete(
  "/:id",
  catchAsync(contactController.delete)
);

export default router;