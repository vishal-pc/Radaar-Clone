import express from "express";
import * as adminController from "../controller/admin.contoller";
import { auth, verifyadminToken } from "../../middleware/auth.middleware";

const adminRouter = express.Router();

// Admin routes
adminRouter.post("/admin-register", adminController.adminRegister);
adminRouter.post("/admin-login", adminController.loginAdmin);
adminRouter.get(
  "/get-all-users",
  [auth, verifyadminToken],
  adminController.GetAllUsers
);
adminRouter.post(
  "/block-unblock-user",
  [auth, verifyadminToken],
  adminController.blockUnblockUser
);
adminRouter.post(
  "/deactivated-users",
  [auth, verifyadminToken],
  adminController.deactivateUser
);

export default adminRouter;
