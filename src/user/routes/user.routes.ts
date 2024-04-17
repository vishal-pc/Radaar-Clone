import express from "express";
import { auth } from "../../middleware/auth.middleware";
import validatePayload from "../../utils/payloadValidater";
import * as authController from "../controller/auth.controller";
import * as userController from "../controller/user.controller";
import * as chatController from "../controller/chat.controller";
import * as UserValidations from "../models/user.validation";

const userRouter = express.Router();

// Auth routes
userRouter.post("/send-mobile-otp", authController.MobileNumberOTP);
userRouter.post("/verify-mobile-otp", authController.VerifyMobileNumberOtp);
userRouter.post(
  "/complete-register",
  UserValidations.UserProfileComplete,
  [auth],
  authController.registerOne
);
userRouter.post("/logout", [auth], authController.logout);

// User routes
userRouter.get(
  "/get-all-user-profile",
  [auth],
  userController.GetAllUsersProfile
);
userRouter.get("/get-user-profile", [auth], userController.GetUserProfile);
userRouter.patch(
  "/update-user-profile",
  UserValidations.UpdateProfileValidation,
  [auth],
  userController.UpdateUserProfile
);
userRouter.delete(
  "/delete-my-profile",
  [auth],
  userController.deleteUserProfile
);
userRouter.get(
  "/get-searched-users",
  UserValidations.Search,
  [auth],
  userController.getSearchedUsers
);

// Chat routes
userRouter.post("/block-user", [auth], chatController.blockUser);
userRouter.post(
  "/unblock-user",
  validatePayload(UserValidations.UnblockUser),
  [auth],
  chatController.UnblockUser
);
userRouter.get("/chats", [auth], chatController.MakeChat);
userRouter.delete("/delete-user-chats", [auth], chatController.DeleteChats);

export default userRouter;
