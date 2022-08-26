import { HttpStatus, Injectable } from '@nestjs/common';
import { Channel, User } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelSwitchToPrivate } from './dto/channel-swicthToPrivate.dto';
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
        message: 'Cannot create channel',
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
          Type: 'private',
        },
      });
      res.status(HttpStatus.CREATED).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot create channel',
      });
      return null;
    }
  }

  async updateChannel(
    idChan: number,
    idAdmin: number,
    body: ChannelUpdateDto,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if ((await this.getAdminChan(idChan, idAdmin)) === undefined) throw Error;
      return await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          Name: body.name,
          Description: body.Description,
        },
      });
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot add user to channel',
      });
      return null;
    }
  }

  async addUser(
    id: number,
    res: Response,
    body: ChannelAddUserDto,
  ): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.update({
        where: { id: id },
        data: { Users: { connect: { id: Number(body.user_id) } } },
        include: { Users: true },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot add user to channel',
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
        message: 'Cannot remove user of this channel',
      });
      return null;
    }
  }

  async getOwner(idChan: number): Promise<number> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Owner: true },
    });
    return channel.Owner.id;
  }

  async getAdminChan(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Admins: true },
    });
    return channel.Admins.find((User) => User.id === idUser);
  }

  async getUser(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Users: true },
    });
    return channel.Users.find((User) => User.id === idUser);
  }

  async addAdmin(
    idChan: number,
    idToAdd: number,
    idAdmin: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getUser(idChan, idToAdd)) === undefined ||
        (await this.getAdminChan(idChan, idAdmin)) !== undefined ||
        (await this.getAdminChan(idChan, idToAdd)) !== undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Admins: { connect: { id: idToAdd } } },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot add user to admin',
      });
      return null;
    }
  }

  async removeAdmin(
    idChan: number,
    idRemove: number,
    idAdmin: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getOwner(idChan)) === idRemove ||
        (await this.getAdminChan(idChan, idAdmin)) !== undefined ||
        (await this.getUser(idChan, idRemove)) === undefined ||
        (await this.getAdminChan(idChan, idRemove)) === undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Admins: { disconnect: { id: idRemove } } },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot remove user to admin',
      });
      return null;
    }
  }

  async kickUser(
    idChan: number,
    idKicker: number,
    idToKick: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      let channel = await this.prisma.channel.findFirst({
        where: { id: idChan },
      });
      if (
        channel.OwnerID === idToKick ||
        (await this.getAdminChan(idChan, idKicker)) === undefined ||
        (await this.getUser(idChan, idToKick)) === undefined
      )
        throw Error;
      channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Users: { disconnect: { id: idToKick } } },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot kick user of this channel',
      });
      return null;
    }
  }

  async switchToPrivate(
    idChan: number,
    idAdmin: number,
    body: ChannelSwitchToPrivate,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if ((await this.getAdminChan(idChan, idAdmin)) === undefined) throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Password: body.Password, Type: 'protected' },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot kick user of this channel',
      });
      return null;
    }
  }
}
