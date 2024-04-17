import { Request, Response } from "express";
import { getErrorMessage } from "../../utils/errors";
import * as authServices from "../services/auth.services";

export interface IGetUserAuthInfoRequest extends Request {
  user: object; // or any other type
}

export const MobileNumberOTP = async (req: Request, res: Response) => {
  try {
    // console.log('req.body---->>>>', req);
    const foundNumber = await authServices.mobileNumberOTP(req.body);
    res.status(200).send(foundNumber);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const VerifyMobileNumberOtp = async (req: Request, res: Response) => {
  try {
    const result = await authServices.VerifyMobileNumberOtp(req.body);
    res.status(200).send(result);
  } catch (error) {
    // console.log("errorerrorerrorerror", error);
    return res.status(500).send(getErrorMessage(error));
  }
};

export const registerOne = async (req: any, res: Response) => {
  try {
    const userData: any = await authServices.findUserByID(req?.user?.id);
    // console.log("first ------- > ", userData);
    if (userData && userData.user && userData.user?.IsprofileComplete == true) {
      return res.status(200).json({
        status: false,
        message: "User Already Registered",
        user_details: userData,
      });
    } else if (
      userData == false ||
      userData?.user?.IsprofileComplete == false
    ) {
      const NewuserData = await authServices.register(req?.body, req?.user?.id);
      // const NewuserData : any = await authServices.findUserByID(req?.user?.id);
      if (NewuserData.status) {
        return res.status(200).json({
          status: true,
          message: "User registered successfully",
          user_details: {
            user: NewuserData.userDetails,
          },
        });
      } else {
        return res.status(200).json({
          status: NewuserData.status,
          message: NewuserData.message,
        });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    const result = await authServices.logout(req?.user?.id);
    res.status(200).send(result);
  } catch (error) {
    // console.log("logout", error);
    return res.status(500).send(getErrorMessage(error));
  }
};
