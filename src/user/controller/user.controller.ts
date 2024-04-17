import { Request, Response } from "express";
import { getErrorMessage } from "../../utils/errors";
import * as userServices from "../services/user.services";
import { CustomRequest } from "../../middleware/auth.middleware";
import User from "../models/user.model";
import mongoose from "mongoose";

export interface IGetUserAuthInfoRequest extends Request {
  user: object; // or any other type
}

export const GetAllUsersProfile = async (req: any, res: Response) => {
  try {
    const GetUserProfileById = await userServices.GetAllUsersProfile(
      req.user.id
    );
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

export const GetUserProfile = async (req: any, res: Response) => {
  try {
    const userProfile = await userServices.GetUserProfileAllDetails(
      req.user.id
    );
    if (userProfile) {
      res.status(200).send(userProfile);
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

export const UpdateUserProfile = async (req: any, res: Response) => {
  try {
    (req as CustomRequest).user = req?.user;
    const ProfileCompleted = await userServices.UpdateUserProfile(
      req.body,
      req.user
    );
    res.status(200).send(ProfileCompleted);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const deleteUserProfile = async (req: any, res: Response) => {
  try {
    const result = await userServices.deleteUserProfile(req.user.id);
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const getSearchedUsers = async (req: any, res: Response) => {
  try {
    const result = await userServices.getSearchedUsers(req.body, req.user.id);
    res.status(200).send(result);
  } catch (error) {
    // console.log("error", error);
    return res.status(500).send(getErrorMessage(error));
  }
};
