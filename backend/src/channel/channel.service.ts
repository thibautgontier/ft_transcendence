import { Injectable } from '@nestjs/common';
import { Channel, channelType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Channel[]> {
    return this.prisma.channel.findMany();
  }

  async findID(id: number): Promise<Channel | null> {
  return this.prisma.channel.findUnique({ where : {id: id}});
  }

  async createChannel(body : ChannelCreateDto): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.create({
        data: {
          Type: body.type,
          Users: {
            connect: {
              id: body.owner,
            },
          },
          Owner: {
            connect: {
              id: body.owner,
            },
          },
          Admins: {
            connect: {
              id: body.owner,
            },
          },
          Password: body.password,
        },
      });
    } catch (error)
    {
      return null;
    }
  }
}
