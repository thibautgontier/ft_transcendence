import { HttpStatus, Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Channel[]> {
    return this.prisma.channel.findMany();
  }

  async findID(id: number): Promise<Channel | null> {
    return this.prisma.channel.findUnique({ where: { id: id } });
  }

  async createChannel(
    res: Response,
    body: ChannelCreateDto,
  ): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.create({
        data: {
          Type: body.type,
          Users: { connect: { id: Number(body.owner) } },
          Owner: { connect: { id: Number(body.owner) } },
          Admins: { connect: { id: Number(body.owner) } },
          Password: body.password,
        },
      });
      res.status(HttpStatus.CREATED).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: "Can't create channel",
      });
      return null;
    }
  }
}
