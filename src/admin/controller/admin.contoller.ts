import { Request, Response } from "express";
import * as adminServices from "../services/admin.service";
import { getErrorMessage } from "../../utils/errors";
import Admin from "../models/admin.model";

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, mobile, bio, password, type } =
      req.body;

    const result = await adminServices.registerAdmin(
      first_name,
      last_name,
      email,
      mobile,
      bio,
      password,
      type
    );

    return res.status(201).send({ message: result.message, success: true });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return res.status(500).json({ message: errorMessage, success: false });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const getUser = await Admin.findOne({
      email: req.body.email,
      IsAdmin: true,
    });
    if (!getUser) {
      return res.status(404).json({
        message: "Admin does not exists with this email!",
        status: false,
      });
    }
    const foundUser = await adminServices.loginAdmin(req.body);

    if (!foundUser?.status) {
      return res.status(401).json({
        message: "Please enter valid credentionals!",
        status: false,
      });
    }
    return res.status(200).send(foundUser);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const GetAllUsers = async (req: any, res: Response) => {
  try {
    const GetUserProfileById = await adminServices.GetAllUsers(req.user.id);
    if (GetUserProfileById) {
      res.status(200).send(GetUserProfileById);
    } else {
      return res.status(500).send({
        message: "User not found",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const blockUnblockUser = async (req: Request, res: Response) => {
  try {
    const { user_id, set_status } = req.body;
    const result = await adminServices.blockUnblockUser(user_id, set_status);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { page, size, searchValue } = req.body;
    const result = await adminServices.deactivateUser(page, size, searchValue);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};
