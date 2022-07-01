import { channelType, } from "@prisma/client";

export class ChannelCreateDto {
  type: channelType;
  users: number;
  owner: number;
  admins: number;
  mutedUsers: number;
  messages: number;
  password?: string;
}