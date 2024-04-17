import { Request, Response } from "express";
import { getErrorMessage } from "../../utils/errors";
import * as chatServices from "../services/chat.services";
import * as UserInterface from "../user.interface";
import Block from "../models/block.model";
import mongoose from "mongoose";
import Chat from "../models/chat.model";
import { SendUnblockedEvent } from "../../socket/index.socket";

export interface IGetUserAuthInfoRequest extends Request {
  user: object; // or any other type
}

export const blockUser = async (req: any, res: Response) => {
  try {
    const result = await chatServices.blockReportUser(req.body, req.user.id);
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const UnblockUser = async (req: any, res: Response) => {
  try {
    const result = await Block.findOne({
      _id: new mongoose.Types.ObjectId(req.body.id),
    });
    if (result) {
      const participants = [result.blockerUserId, result.blockedUserId].sort();
      const existingChat: UserInterface.UserChat | any = await Chat.findOne({
        participants,
      });
      const Unblockuser = await Block.deleteOne({
        _id: new mongoose.Types.ObjectId(req.body.id),
      });
      if (Unblockuser && existingChat && existingChat._id) {
        await SendUnblockedEvent(
          existingChat._id,
          result.blockerUserId,
          result.blockedUserId
        );
      }
    }
    res.status(200).send({
      status: true,
      message: "User unblocked",
    });
  } catch (error) {
    // console.log("error", error);
    return res.status(500).send(getErrorMessage(error));
  }
};

export const MakeChat = async (req: any, res: Response) => {
  try {
    const result = await chatServices.MakeChat(req.body, req.user.id);
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const DeleteChats = async (req: any, res: Response) => {
  try {
    const result = await chatServices.DeleteChats(req?.user?.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    // console.log("logout", error);
    return res.status(500).send(getErrorMessage(error));
  }
};
