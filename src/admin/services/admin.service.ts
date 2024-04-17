import User from "../../user/models/user.model";
import bcrypt from "bcryptjs";
import * as adminTypes from "../../../types/admin.interface";
import jwt from "jsonwebtoken";
import redisClient from "../../helper/radis/index.redis";
import Admin from "../models/admin.model";
import { emailValidate, passwordRegex } from "../../helper/validations/helper";
import { getErrorMessage } from "../../utils/errors";
import mongoose from "mongoose";
import { envConfig } from "../../config/env.config";
envConfig;

export const registerAdmin = async (
  first_name: string,
  last_name: string,
  email: string,
  mobile: string,
  bio: string,
  password: string,
  type: string
) => {
  try {
    if (!emailValidate(email)) {
      return {
        message: "Invalid email format",
        success: false,
      };
    }
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      throw new Error(`Admin with email ${email} already exists`);
    }
    // Validate password strength
    if (!passwordRegex.test(password)) {
      return {
        message:
          "Password must have at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (#?!@$%^&*-)",
        success: false,
      };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      first_name,
      last_name,
      email,
      mobile,
      bio,
      password: hashedPassword,
      IsAdmin: true,
      type,
    };

    const userSaved = await Admin.create(newUser);
    if (userSaved.id) {
      return { message: "Admin Register successful", success: true };
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error("Error in register admin!", error);
    throw new Error("Error in register admin!");
  }
};

export const loginAdmin = async (data: adminTypes.login) => {
  try {
    const email = data.email;
    const password = data.password;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return { message: "User not found", status: false };
    }

    return bcrypt
      .compare(password, `${admin?.password}`)
      .then(async (bResult) => {
        if (!bResult) {
          return {
            status: false,
            message: "Incorrect Password",
          };
        } else if (bResult) {
          const token = jwt.sign(
            {
              id: admin._id,
              type: admin.type,
              first_name: admin.first_name,
              last_name: admin.last_name,
              email: admin.email,
            },
            envConfig.Jwt_Secret,
            { expiresIn: envConfig.Jwt_Expiry_Hours }
          );
          await redisClient.set(`user_${admin._id}`, token);
          const userDetails = {
            message: "Admin Signed In",
            status: true,
            token: token,
            IsAdmin: admin.IsAdmin,
          };
          return userDetails;
        }
      });
  } catch (err) {
    console.log("loginAdmin errrr", err);
    return {
      status: true,
      message: "Something went wrong",
    };
  }
};

export const GetAllUsers = async (id: any) => {
  try {
    const findAllUsers = await User.find({});
    if (findAllUsers) {
      return findAllUsers;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const blockUnblockUser = async (
  user_id: string,
  set_status: boolean
) => {
  try {
    const userId = new mongoose.Types.ObjectId(user_id);
    const result = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        is_user_active: set_status,
      }
    );
    return {
      status: true,
      message: set_status ? "User Activated" : "User Deactivated",
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deactivateUser = async (
  page: number,
  size: number,
  searchValue?: string
) => {
  try {
    const pageSize = size || 10;
    const skip = (page - 1) * pageSize;

    const matchQuery: any = {
      is_user_active: false,
    };

    if (searchValue) {
      matchQuery.$or = [
        { first_name: { $regex: searchValue, $options: "i" } },
        { last_name: { $regex: searchValue, $options: "i" } },
      ];
    }

    const users = await User.aggregate([
      {
        $match: matchQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
    ]);

    const totalUsers = await User.countDocuments(matchQuery);

    return {
      status: true,
      users: users,
      page: page,
      totalPages: Math.ceil(totalUsers / pageSize),
      pageSize: pageSize,
      totalUsers: totalUsers,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
