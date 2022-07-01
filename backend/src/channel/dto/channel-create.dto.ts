import { channelType, } from "@prisma/client";

export class ChannelCreateDto {
  type: channelType;
  owner: number;
  password?: string;
}