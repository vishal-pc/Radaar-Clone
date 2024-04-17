import User from "../models/user.model";
import jwt from "jsonwebtoken";
import * as UserInterface from "../user.interface";
import mongoose from "mongoose";
import Block from "../models/block.model";
import redisClient from "../../helper/radis/index.redis";
import UserFCM from "../models/userfcm.model";
import { envConfig } from "../../config/env.config";

// import {User}
const jwtSecret = envConfig.Jwt_Secret;
const tokenExpiresIn = envConfig.Jwt_Expiry_Hours;

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

export const GetAllUsersProfile = async (id: any) => {
  try {
    const findAllUsers = await User.find({ _id: { $ne: id } });
    if (findAllUsers) {
      return findAllUsers;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const GetUserProfileAllDetails = async (id: any) => {
  try {
    const user_id = new mongoose.Types.ObjectId(id);
    const getUserDetails: any = await User.find({ _id: user_id });
    // console.log("getUserDetails", getUserDetails);
    if (getUserDetails) {
      const userDetails = {
        getUserDetails: getUserDetails,
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

export const generateToken = async (
  payload: object,
  salt: string,
  options: jwt.SignOptions
): Promise<string> => {
  return new Promise((res, rej) => {
    jwt.sign(payload, salt, options, (err, token) => {
      if (err) {
        return rej(err);
      }
      res(token!);
    });
  });
};

export function generateAccessToken(
  user: UserInterface.userTypes | any
): Promise<string> {
  return generateToken({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: tokenExpiresIn,
  });
}

export const UpdateUserProfile = async (
  body: UserInterface.userTypes,
  user: { id: number; token: string }
) => {
  const userId = user.id;
  const conditions = {
    _id: userId,
  };
  const update = {
    first_name: body.first_name,
    last_name: body.last_name,
    bio: body.bio,
    address: body.address,
  };

  const Updateuser = await User.findOneAndUpdate(conditions, update);
  // console.log("UpdateuserUpdateuser", Updateuser);
  if (Updateuser) {
    return {
      status: true,
      message: "Profile updated successfully",
    };
  } else {
    return {
      status: false,
      message: "User Not updated",
    };
  }
};

export const deleteUserProfile = async (user_id: string) => {
  try {
    const userId = new mongoose.Types.ObjectId(user_id);
    await User.findOneAndUpdate(
      { _id: userId },
      { is_user_active: false, isOnline: false }
    );
    await UserFCM.deleteMany({ user_id: userId });
    await redisClient.set(
      `userStatus:${user_id}`,
      JSON.stringify({ currentChat: null, online: false })
    );
    return {
      status: true,
      message: "Account deleted",
    };
  } catch (err) {
    return {
      status: true,
      message: "Cannot delete account try again later",
    };
  }
};

export const getSearchedUsers = async (
  body: UserInterface.Searchuser,
  user_id: string
) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(user_id);
    const searchValue = body?.searchValue;
    const page = body?.page;
    const pageSize = 10;
    // const user_preferences: any = await findUserByWhere({ _id: currentUserId });
    const blockedUserIds = (
      await Block.find({ blockerUserId: currentUserId })
    ).map((block) => new mongoose.Types.ObjectId(block?.blockedUserId));

    const blockerUserIds = (
      await Block.find({ blockedUserId: currentUserId })
    ).map((block) => new mongoose.Types.ObjectId(block.blockerUserId));
    const findUser = await User.aggregate([
      {
        $addFields: {
          full_name: { $concat: ["$first_name", " ", "$last_name"] },
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { first_name: { $regex: searchValue, $options: "i" } },
                { last_name: { $regex: searchValue, $options: "i" } },
                { full_name: { $regex: searchValue, $options: "i" } },
              ],
            },
            {
              _id: {
                $nin: [currentUserId, ...blockedUserIds, ...blockerUserIds],
              },
            },
            { IsprofileComplete: true },
            { is_user_active: true },
          ],
        },
      },
    ])
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (findUser.length > 0) {
      return {
        users: findUser,
        status: true,
        message: "Users found",
      };
    } else {
      return {
        users: [],
        status: false,
        message: "No users found",
      };
    }
  } catch (err) {
    // console.log(err);
    return {
      status: false,
      message: "Something went wrong",
    };
  }
};

export const updateUserDataInDatabase = async (user_id: any, changes: any) => {
  try {
    const findUser = await User.findOneAndUpdate({ _id: user_id }, changes);
    // console.log("findUserfindUserfindUser", findUser);
    if (findUser) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // console.log("updateUserDataInDatabaseerrrr---->", err);
    return false;
  }
};
