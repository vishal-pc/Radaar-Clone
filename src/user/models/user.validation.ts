import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

// ------------------- Create Admin Validation for Body starts -------------------
const linkSchema = yup.object({
  body: yup.object({
    first_name: yup.string().max(255).required().label("first_name"),
    last_name: yup.string().max(255).label("last_name"),
    email: yup.string().required().label("email"),
    address: yup.string().required().label("address"),
    bio: yup.string().required().label("bio"),
  }),
});

const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
      });
      return next();
    } catch (err: any) {
      return res
        .status(200)
        .json({ status: false, type: err.name, message: err.message });
    }
  };

export const UserProfileComplete = validate(linkSchema);

// ------------------- Create Admin Validation for Body Ends -------------------

// ------------------- Update Admin validation starts -------------------
const linkSchemaUpdateProfile = yup.object({
  body: yup.object({
    // email: yup.string().email().required().label('Email'),
    // password: yup.string().min(8).max(32).required().label('password'),
    first_name: yup.string().min(3).max(255).required().label("first_name"),
    last_name: yup.string().min(3).max(255).required().label("last_name"),
    bio: yup.string().required().label("bio"),
    address: yup.string().required().label("address"),
  }),
});

const UpdateProfile =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
      });
      return next();
    } catch (err: any) {
      return res
        .status(200)
        .json({ status: false, type: err.name, message: err.message });
    }
  };

export const UpdateProfileValidation = UpdateProfile(linkSchemaUpdateProfile);

// ------------------- Update Admin validation Ends -------------------

// ------------------- User Search Validation starts -------------------
const SearchSchema = yup.object({
  body: yup.object({
    searchValue: yup.string().label("Please Send value to be searched in body"),
    page: yup.number().required().label("swipeDirection"),
  }),
});

const ValidateSearch =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
      });
      return next();
    } catch (err: any) {
      return res
        .status(200)
        .json({ status: false, type: err.name, message: err.message });
    }
  };

export const Search = ValidateSearch(SearchSchema);

// ------------------- User Search Validation Ends -------------------

// ------------------- User Search Validation Ends -------------------

// ------------------- User Search Validation starts -------------------
const SaveFCMSchema = yup.object({
  body: yup.object({
    user_fcm: yup.string().label("user_fcm is required"),
    device_id: yup.string().label("device_id is required"),
  }),
});

const ValideUserFCM =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
      });
      return next();
    } catch (err: any) {
      return res
        .status(200)
        .json({ status: false, type: err.name, message: err.message });
    }
  };

export const UserFCM = ValideUserFCM(SaveFCMSchema);

// ------------------- User Search Validation Ends -------------------

export const UnblockUser = yup.object({
  body: yup.object({
    id: yup.string().label("id is required"),
  }),
});
