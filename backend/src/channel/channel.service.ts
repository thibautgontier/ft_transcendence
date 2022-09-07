import { HttpStatus, Injectable, Session } from '@nestjs/common';
import { Channel, Message, User } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelSendMsgDto } from './dto/channel-sendMessage.dto';
import { ChannelSwitchToPrivateDto } from './dto/channel-swicthToPrivate.dto';
import { ChannelUpdateDto } from './dto/channel-update.dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Channel[]> {
    return this.prisma.channel.findMany({
      include: { Messages: true },
    });
  }

  async findID(id: number): Promise<Channel | null> {
    return this.prisma.channel.findUnique({
      where: { id: id },
      include: { Messages: true },
    });
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
          Name: body.Name,
		  RoomId: body.RoomId
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

  async deleteChannel(
    idChan: number,
    idAdmin: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if ((await this.getAdminChan(idChan, idAdmin)) === undefined) throw Error;
      const channel = await this.prisma.channel.delete({
        where: { id: idChan },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cannot delete channel',
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
		  Name: body.Name,
		  RoomId: body.RoomId
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
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          Name: body.name,
          Description: body.Description,
		  RoomId: body.RoomId
        },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot update Channel',
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

  async getMutedUsers(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { MutedUsers: true },
    });
    return channel.MutedUsers.find((User) => User.id === idUser);
  }

  async getBanUsers(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { BanUsers: true },
    });
    return channel.BanUsers.find((User) => User.id === idUser);
  }

  async getUser(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Users: true },
    });
    return channel.Users.find((User) => User.id === idUser);
  }

  async getMessage(idChan: number, idMessage: number): Promise<Message> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Messages: true },
    });
    return channel.Messages.find((Message) => Message.id === idMessage);
  }

  async getSender(idMessage: number, idUser: number): Promise<number> {
    const msg = await this.prisma.message.findUnique({
      where: { id: idMessage },
      select: { User: true },
    });
    return msg.User.id;
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
        (await this.getAdminChan(idChan, idAdmin)) === undefined ||
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

  async switchToPrivate(
    idChan: number,
    idAdmin: number,
    body: ChannelSwitchToPrivateDto,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getAdminChan(idChan, idAdmin)) === undefined ||
        body.Password === undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Password: body.Password, Type: 'protected' },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot switch public to protected',
      });
      return null;
    }
  }

  async switchToPublic(
    idChan: number,
    idAdmin: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if ((await this.getAdminChan(idChan, idAdmin)) === undefined) throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: { Type: 'public', Password: null },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot switch protected to public',
      });
      return null;
    }
  }

  async sendMessage(
    idChan: number,
    idUser: number,
    res: Response,
    body: ChannelSendMsgDto,
  ): Promise<Message | null> {
    try {
      console.log(body.Content);
      if ((await this.getUser(idChan, idUser)) === undefined) {
        console.log('1\n');
        throw Error;
      }
      if ((await this.getMutedUsers(idChan, idUser)) !== undefined) {
        console.log('2\n');
        throw Error;
      }
      if (body.Content.length == undefined) {
        console.log('CONTENT.LENGTH == UNDEFINED™2@@\n');
        throw Error;
      }
      const msg = await this.prisma.message.create({
        data: {
          Content: body.Content,
          User: { connect: { id: idUser } },
          Channel: { connect: { id: idChan } },
        },
      });
      res.status(HttpStatus.CREATED).send(msg);
      return msg;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot send message to channel',
      });
      return null;
    }
  }

  async removeMessage(
    idChan: number,
    idMessage: number,
    idUser: number,
    res: Response,
  ): Promise<Message | null> {
    try {
      if (
        (await this.getMessage(idChan, idMessage)) === undefined ||
        ((await this.getAdminChan(idChan, idUser)) === undefined &&
          (await this.getSender(idMessage, idUser)) !== idUser)
      )
        throw Error;
      const msg = await this.prisma.message.delete({
        where: { id: idMessage },
      });
      res.status(HttpStatus.OK).send(msg);
      return msg;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot remove message from channel',
      });
      return null;
    }
  }

  async editMessage(
    idChan: number,
    idMessage: number,
    idUser: number,
    body: ChannelSendMsgDto,
    res: Response,
  ): Promise<Message | null> {
    try {
      if (
        (await this.getMessage(idChan, idMessage)) === undefined ||
        (await this.getBanUsers(idChan, idUser)) !== undefined ||
        (await this.getMutedUsers(idChan, idUser)) !== undefined ||
        ((await this.getAdminChan(idChan, idUser)) === undefined &&
          (await this.getSender(idMessage, idUser)) !== idUser)
      )
        throw Error;
      const msg = await this.prisma.message.update({
        where: { id: idMessage },
        data: { Content: body.Content },
      });
      res.status(HttpStatus.OK).send(msg);
      return msg;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot edit message from channel',
      });
      return null;
    }
  }

  async muteUser(
    idChan: number,
    idAdmin: number,
    idUser: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getAdminChan(idChan, idAdmin)) === undefined ||
        (await this.getOwner(idChan)) === idUser ||
        (await this.getAdminChan(idChan, idUser)) !== undefined ||
        (await this.getMutedUsers(idChan, idUser)) !== undefined
      )
        throw Error;
      const chan = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          MutedUsers: { connect: { id: idUser } },
        },
      });
      res.status(HttpStatus.OK).send(chan);
      return chan;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot mute user',
      });
      return null;
    }
  }

  async unmuteUser(
    idChan: number,
    idAdmin: number,
    idUser: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getAdminChan(idChan, idAdmin)) === undefined ||
        (await this.getMutedUsers(idChan, idUser)) === undefined
      )
        throw Error;
      const chan = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          MutedUsers: { disconnect: { id: idUser } },
        },
      });
      res.status(HttpStatus.OK).send(chan);
      return chan;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot unmute user',
      });
      return null;
    }
  }

  async banUser(
    idChan: number,
    idAdmin: number,
    idUser: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getOwner(idChan)) === idUser ||
        (await this.getAdminChan(idChan, idUser)) !== undefined ||
        (await this.getAdminChan(idChan, idAdmin)) === undefined ||
        (await this.getUser(idChan, idUser)) === undefined ||
        (await this.getBanUsers(idChan, idUser)) !== undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          Users: { disconnect: { id: idUser } },
          BanUsers: { connect: { id: idUser } },
        },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot ban user of this channel',
      });
      return null;
    }
  }

  async unbanUser(
    idChan: number,
    idAdmin: number,
    idUser: number,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getAdminChan(idChan, idAdmin)) === undefined ||
        (await this.getBanUsers(idChan, idUser)) === undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          BanUsers: { disconnect: { id: idUser } },
        },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot unban user of this channel',
      });
      return null;
    }
  }
}
