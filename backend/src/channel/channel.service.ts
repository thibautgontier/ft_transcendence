import { HttpStatus, Injectable, Session } from '@nestjs/common';
import { BanModel, Channel, Message, User } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { BanOrMuteUserDto } from './dto/channel-banUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelSendMsgDto } from './dto/channel-sendMessage.dto';
import { ChannelSwitchToPrivate } from './dto/channel-swicthToPrivate.dto';
import { ChannelUpdateDto } from './dto/channel-update.dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Channel[]> {
    return await this.prisma.channel.findMany({
      include: { Messages: true, Users: true, Admins: true },
    });
  }

  async findID(id: number): Promise<Channel | null> {
    return await this.prisma.channel.findUnique({
      where: { id: id },
      include: { Messages: true, Users: true, Admins: true },
    });
  }

  async isPrivateCreated(id1: number, id2: number): Promise<Channel | null> {
    try {
      const channels = await this.prisma.channel.findMany({
        where: {
          Type: 'private',
        },
        include: { Users: true },
      });
      for (let i of channels) {
        if (
          i.Users.find((Users) => Users.id == id1) != undefined &&
          i.Users.find((Users) => Users.id == id2) != undefined
        )
          return i;
      }
      return null;
    } catch (error) {
      console.log('ERROR:', error);
      return null;
    }
  }

  async isAdmin(idChan: number, idUser: number): Promise<boolean> {
    try {
      const chan = await this.prisma.channel.findUnique({
        where: { id: idChan },
        select: { Admins: true },
      });
      if (chan.Admins.find((User) => User.id == idUser) != undefined)
        return true;
      else return false;
    } catch (e) {
      return false;
    }
  }

  async isOwner(idChan: number, idUser: number): Promise<boolean> {
    try {
      const chan = await this.prisma.channel.findUnique({
        where: { id: idChan },
      });
      if (chan.OwnerID === idUser)
        return true;
      else return false;
    } catch (e) {
      return false;
    }
  }

  async createChannel(
    res: Response,
    body: ChannelCreateDto,
  ): Promise<Channel | null> {
    try {
      const pw = await this.prisma.channelPassword.create({
        data: {},
      });
      const channel = await this.prisma.channel.create({
        data: {
          Password: { connect: { id: pw.id } },
          Owner: { connect: { id: Number(body.owner) } },
          Users: { connect: { id: Number(body.owner) } },
          Admins: { connect: { id: Number(body.owner) } },
          Name: body.Name,
          RoomId: body.RoomId,
        },
        include: {
          Users: true,
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
      if (
        (await this.getAdminChan(idChan, idAdmin)) === undefined &&
        idAdmin != 0
      )
        throw Error;
      const channel = await this.prisma.channel.delete({
        where: { id: idChan },
      });
      const pw = await this.prisma.channelPassword.delete({
        where: { id: channel.PasswordID },
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
      const pw = await this.prisma.channelPassword.create({
        data: {},
      });
      const channel = await this.prisma.channel.create({
        data: {
          Password: { connect: { id: pw.id } },
          Owner: { connect: { id: Number(body.user_1) } },
          Users: {
            connect: [{ id: Number(body.user_1) }, { id: Number(body.user_2) }],
          },
          Admins: {
            connect: [{ id: Number(body.user_1) }, { id: Number(body.user_2) }],
          },
          Type: 'private',
          Name: body.Name,
          RoomId: body.RoomId,
        },
        include: {
          Users: true,
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
        },
      });
      if (body.Password) {
        const pw = await this.prisma.channelPassword.update({
          where: { id: channel.PasswordID },
          data: {
            Password: body.Password,
          },
        });
      }
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

  async updateId(
    idChan: number,
    body: ChannelUpdateDto,
    res: Response,
  ): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          RoomId: body.RoomId,
        },
      });
      res.status(HttpStatus.OK).send(channel);
      return channel;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot update roomID',
      });
      return null;
    }
  }

  async addUser(
    id_chan: number,
    res: Response,
    body: ChannelAddUserDto,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.checkPassword(id_chan, body)) != true ||
        (await this.getBanUsers(id_chan, body.user_id)) != undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: id_chan },
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
      if (
        channel.Users.length == 0 ||
        (channel.Users.length == 1 && channel.Type == 'private')
      )
        return this.deleteChannel(idChan, 0, res);
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

  async checkPassword(
    idChan: number,
    body: ChannelAddUserDto,
  ): Promise<boolean> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: idChan,
      },
    });
    const password = await this.prisma.channelPassword.findUnique({
      where: { id: channel.PasswordID },
    });
    if (
      (channel.Type == 'protected' && password.Password == body.password) ||
      channel.Type == 'public'
    )
      return true;
    return false;
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
    return channel.Admins.find((User) => User.id == idUser);
  }

  async getMutedUsers(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { MutedUsers: true },
    });
    return channel.MutedUsers.find((User) => User.id == idUser);
  }

  async getBanUsers(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { BanUsers: true },
    });
    return channel.BanUsers.find((User) => User.id == idUser);
  }

  async getUser(idChan: number, idUser: number): Promise<User> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Users: true },
    });
    return channel.Users.find((User) => User.id == idUser);
  }

  async getMessage(idChan: number, idMessage: number): Promise<Message> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: idChan },
      select: { Messages: true },
    });
    return channel.Messages.find((Message) => Message.id == idMessage);
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
        (await this.getOwner(idChan)) !== idAdmin ||
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
    body: ChannelSwitchToPrivate,
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
        data: { Type: 'protected' },
      });
      const pw = await this.prisma.channelPassword.update({
        where: { id: channel.PasswordID },
        data: {
          Password: body.Password,
        },
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
        message: 'Cannot switch private to public',
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
      if ((await this.getUser(idChan, idUser)) === undefined) {
        throw Error;
      }
      if ((await this.getMutedUsers(idChan, idUser)) !== undefined) {
        throw Error;
      }
      if (body.Content == undefined) {
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
    body: BanOrMuteUserDto,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getAdminChan(body.idChan, body.idAdmin)) === undefined ||
        (await this.getOwner(body.idChan)) === body.idUser ||
        (await this.getAdminChan(body.idChan, body.idUser)) !== undefined ||
        (await this.getMutedUsers(body.idChan, body.idUser)) !== undefined
      )
        throw Error;
      const chan = await this.prisma.channel.update({
        where: { id: body.idChan },
        data: {
          MutedUsers: { connect: { id: body.idUser } },
        },
      });
      const mute = await this.prisma.banModel.create({
        data: {
          User: { connect: { id: body.idUser } },
          Channel: { connect: { id: body.idChan } },
          Type: 'mute',
          Reason: body.reason,
          Duration: body.duration,
        },
      });
      if (body.duration > 0)
        setTimeout(async () => {
          await this.rmSanction2(mute.id);
          console.log('unmuted');
        }, body.duration * 60000);
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

  async unmuteUser(idChan: number, idUser: number): Promise<Channel | null> {
    try {
      if ((await this.getMutedUsers(idChan, idUser)) === undefined) throw Error;
      const chan = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          MutedUsers: { disconnect: { id: idUser } },
        },
      });
      return chan;
    } catch (error) {
      return null;
    }
  }

  async banUser(
    body: BanOrMuteUserDto,
    res: Response,
  ): Promise<Channel | null> {
    try {
      if (
        (await this.getOwner(body.idChan)) === body.idUser ||
        (await this.getAdminChan(body.idChan, body.idUser)) !== undefined ||
        (await this.getAdminChan(body.idChan, body.idAdmin)) === undefined ||
        (await this.getUser(body.idChan, body.idUser)) === undefined ||
        (await this.getBanUsers(body.idChan, body.idUser)) !== undefined
      )
        throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: body.idChan },
        data: {
          Users: { disconnect: { id: body.idUser } },
          BanUsers: { connect: { id: body.idUser } },
        },
      });
      const ban = await this.prisma.banModel.create({
        data: {
          User: { connect: { id: body.idUser } },
          Channel: { connect: { id: body.idChan } },
          Type: 'ban',
          Reason: body.reason,
          Duration: body.duration,
        },
      });
      if (body.duration > 0)
        setTimeout(async () => {
          this.rmSanction2(ban.id);
          console.log('unbaned');
        }, body.duration * 60000);
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

  async unbanUser(idChan: number, idUser: number): Promise<Channel | null> {
    try {
      if ((await this.getBanUsers(idChan, idUser)) === undefined) throw Error;
      const channel = await this.prisma.channel.update({
        where: { id: idChan },
        data: {
          BanUsers: { disconnect: { id: idUser } },
        },
      });
      return channel;
    } catch (error) {
      return null;
    }
  }

  async getSanction(idChan: number, res: Response): Promise<BanModel[] | null> {
    try {
      const sanction = await this.prisma.banModel.findMany({
        where: { ChannelID: idChan },
        include: { User: true },
      });
      res.status(HttpStatus.OK).send(sanction);
      return sanction;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot find Sanction',
      });
      return null;
    }
  }

  async rmSanction(id: number, res?: Response): Promise<BanModel | null> {
    try {
      const ban = await this.prisma.banModel.delete({
        where: { id: id },
      });
      if (ban.Type == 'ban') this.unbanUser(ban.ChannelID, ban.UserID);
      else this.unmuteUser(ban.ChannelID, ban.UserID);
      res.status(HttpStatus.OK).send(ban);
      return ban;
    } catch (e) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Cannot remove banModel',
      });
      return null;
    }
  }

  async rmSanction2(id: number): Promise<BanModel | null> {
    try {
      const ban = await this.prisma.banModel.delete({
        where: { id: id },
      });
      if (ban.Type == 'ban') this.unbanUser(ban.ChannelID, ban.UserID);
      else this.unmuteUser(ban.ChannelID, ban.UserID);
      return ban;
    } catch (e) {
      console.log('Cannot remove banModel');
      return null;
    }
  }
}
