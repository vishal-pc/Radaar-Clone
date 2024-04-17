import User from "../models/user.model";
import * as userTpes from "../user.interface";
import MobileOTP from "../models/verifyOtp.model";
import jwt from "jsonwebtoken";
import * as UserInterface from "../user.interface";
import mongoose from "mongoose";
import { getUserSocketId, sendOfflineEvent } from "../../socket/index.socket";
import redisClient from "../../helper/radis/index.redis";
import UserFCM from "../models/userfcm.model";
import { envConfig } from "../../config/env.config";

// import {User}
const jwtSecret = envConfig.Jwt_Secret;

export const mobileNumberOTP = async (data: userTpes.mobileOtp) => {
  try {
    const mobile_number = data?.mobile;
    if (mobile_number) {
      const currentTime: Date = new Date();
      const existingOTP = await MobileOTP.findOne({
        mobile: mobile_number,
        createdAt: { $gte: new Date(currentTime.valueOf() - 2 * 60 * 1000) }, // used valueof() because left hand operand must be of number, bigint type in typescript
      });
      if (existingOTP) {
        return {
          message:
            "OTP already sent to your mobile number. Try after 2 minutes.",
          status: true,
        };
      } else {
        const currentOtp = await MobileOTP.findOne({
          mobile: mobile_number,
        });
        if (currentOtp) {
          await MobileOTP.deleteOne({ _id: currentOtp._id });
          const otp = 1111;
          const newOTP = new MobileOTP({
            mobile: mobile_number,
            otp: otp,
            age: 30,
          });
          await newOTP.save();
          // SendOtpViaTwilio(mobile_number,otp)
          return {
            message: "Otp sent to mobile number",
            status: true,
          };
        } else {
          const otp = 1111;
          const newOTP = new MobileOTP({
            mobile: mobile_number,
            otp: otp,
            age: 30,
          });
          await newOTP.save();
          // SendOtpViaTwilio(mobile_number,otp)
          return {
            message: "Otp sent to mobile number",
            status: true,
          };
        }
      }
    } else {
      return {
        message: "Please send mobile number",
        status: false,
      };
    }
  } catch (err) {
    // console.log("errerr", err);
  }
};

export const VerifyMobileNumberOtp = async (data: {
  mobile: number | string;
  otp: string | number;
}) => {
  const mobile_number = data?.mobile;
  const OTP = data?.otp;
  if (mobile_number && OTP) {
    const currentTime: Date = new Date();
    const currentOtp = await MobileOTP.findOne({
      mobile: mobile_number,
      createdAt: { $gte: new Date(currentTime.valueOf() - 2 * 60 * 1000) },
    });
    if (currentOtp) {
      if (OTP == currentOtp.otp) {
        const UserExist = await findUserByWhere({
          mobile: mobile_number,
        });
        // console.log("UserExistUserExist", UserExist);
        if (UserExist && UserExist.is_user_active == false) {
          return {
            message: "Account is deleted. Please contact admin.",
            status: false,
          };
        } else if (UserExist && UserExist.IsprofileComplete) {
          const token = jwt.sign({ id: UserExist._id }, jwtSecret, {
            expiresIn: "10m",
          });
          await redisClient.set(`user_${UserExist._id}`, token);
          const user_all_details: any = await findUserByID(UserExist?._id);
          // Give user a empty string for now until the upload is not completed
          await MobileOTP.deleteOne({
            mobile: mobile_number,
          });
          return {
            message: "User already registered",
            status: true,
            token: token,
            IsprofileComplete: UserExist?.IsprofileComplete,
            user_details: user_all_details,
          };
        } else if (UserExist) {
          const token = jwt.sign({ id: UserExist._id }, jwtSecret, {
            expiresIn: "10m",
          });
          await redisClient.set(`user_${UserExist._id}`, token);
          await MobileOTP.deleteOne({
            mobile: mobile_number,
          });
          return {
            message:
              "Mobile number registered successfully, please complete your profile",
            status: true,
            token: token,
            IsprofileComplete: false,
          };
        } else {
          const newUser = new User({
            mobile: mobile_number,
          });
          const newCreatedUser = await newUser.save();
          const token = jwt.sign({ id: newCreatedUser._id }, jwtSecret, {
            expiresIn: "10m",
          });
          await redisClient.set(`user_${newCreatedUser._id}`, token);
          await MobileOTP.deleteOne({
            mobile: mobile_number,
          });
          return {
            message:
              "Mobile number registered successfully, please complete your profile",
            status: true,
            token: token,
            IsprofileComplete: false,
          };
        }
      } else {
        return {
          message: "Invalid OTP",
          status: false,
        };
      }
    } else {
      return {
        message: "OTP has expired please send a new OTP",
        status: false,
      };
    }
  } else {
    return {
      message: "Please send mobile number and OTP",
      status: false,
    };
  }
};

export const register = async (
  data: UserInterface.register,
  user_id: string
) => {
  try {
    const userIdAsObjectId = new mongoose.Types.ObjectId(user_id);
    const newUser = {
      first_name: data?.first_name.trim(),
      last_name: data?.last_name.trim(),
      isOnline: true,
      IsprofileComplete: true,
      bio: data?.bio,
      email: data?.email,
      address: data?.address,
    };
    const updatedUser: any = await User.findOneAndUpdate(
      {
        _id: userIdAsObjectId,
      },
      newUser
    );
    // console.log('updatedUserupdatedUser',updatedUser)
    const userDetails = await User.findById({ _id: user_id });

    return {
      userDetails,
      status: true,
      message: "User registered successfully",
    };
  } catch (err) {
    // console.log("errerrerr", err);
    return {
      status: false,
      message: "Cannot create new user",
    };
  }
};

export const findUserByWhere = async (where: any) => {
  try {
    // console.log(mobile);
    const findUser = await User.findOne(where);
    // console.log(findUser);
    if (findUser) {
      return findUser;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const findUserByMobile = async (mobile: bigint) => {
  try {
    // console.log(mobile);
    const findUser = await User.findOne({ mobile: mobile });
    // console.log(findUser);
    if (findUser) {
      return findUser;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const findUserByID = async (id: any) => {
  try {
    const user = await User.findById(id);
    const user_id = new mongoose.Types.ObjectId(id);
    const getUserDetails = await User.aggregate([
      {
        $match: {
          _id: user_id,
        },
      },
    ]);
    if (user) {
      const userDetails = {
        user,
        getUserDetails: getUserDetails.length ? getUserDetails[0] : {},
      };
      return userDetails;
    } else {
      return false;
    }
  } catch (err) {
    // console.log("errrrrrrr", err);
    return false;
  }
};

export const logout = async (user_id: string) => {
  try {
    const user_mongoose_id = new mongoose.Types.ObjectId(user_id);
    // console.log("user_mongoose_id", user_mongoose_id);
    const remove_user_fcm = await UserFCM.deleteMany({
      user_id: user_mongoose_id,
    });
    const user_soket_id = await getUserSocketId(user_id);
    await sendOfflineEvent(user_id, user_soket_id);
    await removeToken(user_id);
    return {
      status: true,
      message: "User logged out",
    };
  } catch (err) {
    // console.log("logout err", err);
    return {
      status: true,
      message: "User logged out",
      error: err,
    };
  }
};

async function removeToken(userId: string) {
  await redisClient.del(`user_${userId}`);
}
