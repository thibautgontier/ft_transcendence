import { HttpStatus, Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelUpdateDto } from './dto/channel-update.dto';

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
          Owner: { connect: { id: Number(body.owner) } },
          Users: { connect: { id: Number(body.owner) } },
          Admins: { connect: { id: Number(body.owner) } },
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

  async createPrivChannel(
    res: Response,
    body: ChannelCreatePrivDto,
  ): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.create({
        data: {
          Owner: { connect: { id: Number(body.user_1) } },
          Users: {
            connect: [{ id: Number(body.user_1) }, { id: Number(body.user_2) }],
          },
          Admins: {
            connect: [{ id: Number(body.user_1) }, { id: Number(body.user_2) }],
          },
		  Type : "private"
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

  async updateChannel(
    id: number,
    body: ChannelUpdateDto,
  ): Promise<Channel | null> {
    return await this.prisma.channel.update({
      where: { id: id },
      data: {
        Name: body.name,
        Description: body.Description,
      },
    });
  }

  async addUser(
    id: number,
    res: Response,
    body: ChannelAddUserDto,
  ): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.update({
        where: { id: id },
        data: { Users: { connect: { id: Number(body.users_id) } } },
        include: { Users: true },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: "Can't add user to channel",
      });
      return null;
    }
  }

  async removeUser(
    idChan: number,
    idRemove: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Users: { disconnect: { id: idRemove } } },
        include: { Users: true },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: "Can't remove user of this channel",
      });
      return null;
    }
  }
}
