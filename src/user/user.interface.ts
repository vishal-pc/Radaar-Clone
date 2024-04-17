import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import mongoose from "mongoose";
export type mobileOtp = {
  mobile: string;
};

export type VerifyOTP = {
  mobile: string;
  otp: number;
};
type userObjType = {
  id: string;
  token: string;
};
export interface CustomRequest extends Request {
  token: string | JwtPayload;
  user: userObjType;
  // id:string
}

export interface userToken {
  token: string | JwtPayload;
  user: userObjType;
}

export type updateUserLocation = {
  user: any;
  coordinates: Array<number>;
};

export type userTypes = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: String;
  bio: String;
  IsprofileComplete: Boolean;
  isOnline: Boolean;
  _id: string;
  id: string;
  signup_type: string;
  address: number;
};

export interface register extends userTypes {
  signup_type: string;
  age_range: Array<Number>;
}

export type Searchuser = {
  searchValue: string;
  page: number;
};
export type SetUserStatus = {
  online_status: string;
};
export type StoreUserFcm = {
  fcm: string;
  device_id: string;
};

export type UserChat = {
  _id: mongoose.Types.ObjectId;
  participants: [mongoose.Types.ObjectId];
  requestStatus: string;
  initiator: mongoose.Types.ObjectId;
  responder: mongoose.Types.ObjectId;
  isSuggestionActive: {
    type: Boolean;
    default: true;
  };
  IsChatDeleted: [
    {
      userId: mongoose.Types.ObjectId;
      deletedAt: {
        type: Date;
      };
    },
  ];
};
