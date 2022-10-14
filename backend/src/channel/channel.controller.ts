import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BanModel, Channel, Message } from '@prisma/client';
import { Response, Request } from 'express';
import { get } from 'http';
import { number } from 'joi';
import { ChannelService } from './channel.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { BanOrMuteUserDto } from './dto/channel-banUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelSendMsgDto } from './dto/channel-sendMessage.dto';
import { ChannelSwitchToPrivate } from './dto/channel-swicthToPrivate.dto';
import { ChannelUpdateDto } from './dto/channel-update.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService, private authService: AuthService) {}

  @Get()
  async getAll() {
    return this.channelService.getAll();
  }

  @Get(':id')
  async findID(@Req() req: Request, @Param('id') id: number): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.findID(Number(id));
    }
  }

  @Get(`isPrivateCreated/:id1/:id2`)
  async isPrivateCreated(
    @Req() req: Request,
    @Param('id1') id1: number,
    @Param('id2') id2: number,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.isPrivateCreated(Number(id1), Number(id2));
    }
  }

  @Get(':idChannel/isAdmin/:idUser')
  async isAdmin(
    @Req() req: Request,
    @Param('idChannel') idChan: number,
    @Param('idUser') idUser: number,
  ): Promise<boolean> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.isAdmin(Number(idChan), Number(idUser));
    }
  }

  @Get(':idChannel/isOwner/:idUser')
  async isOwner(
    @Req() req: Request,
    @Param('idChannel') idChan: number,
    @Param('idUser') idUser: number,
  ): Promise<boolean> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.isOwner(Number(idChan), Number(idUser));
    }
  }

  @Post('create')
  async createChannel(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChannelCreateDto,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.createChannel(res, body);
    }
  }

  @Delete(':channelid/delete/:idAdmin')
  async deleteChannel(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.deleteChannel( Number(idChan), Number(idAdmin), res);
      }
  }

  @Post('createPriv')
  async createPrivChannel(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChannelCreatePrivDto,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.createPrivChannel(res, body);
    }
  }

  @Patch('update/:idChannel/:idAdmin')
  async updateChannel(
    @Req() req: Request,
    @Param('idChannel') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Body() body: ChannelUpdateDto,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        if (body.RoomId) {
          return await this.channelService.updateId(Number(idChan), body, res);
        } else {
          return await this.channelService.updateChannel(
            Number(idChan),
            Number(idAdmin),
            body,
            res,
          );
        }
      }
    }
  }

  @Patch('addUser/:id')
  async addUser(
    @Req() req: Request,
    @Param('id') id_chan: number,
    @Res() res: Response,
    @Body() body: ChannelAddUserDto,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.channelService.addUser(Number(id_chan), res, body);
    }
  }

  @Patch(':channelid/removeUser/:id')
  async removeUser(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('id') idRemove: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.removeUser(
          Number(idChan),
          Number(idRemove),
          res,
        );
      }
    }
  }

  @Patch(':channelid/addAdmin/:idToAdd/:idAdmin')
  async addAdmin(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idToAdd') idToAdd: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.addAdmin(
          Number(idChan),
          Number(idToAdd),
          Number(idAdmin),
          res,
        );
      }
    }
  }

  @Patch(':channelid/removeAdmin/:idRemove/:idAdmin')
  async removeAdmin(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idRemove') idRemove: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.removeAdmin(
          Number(idChan),
          Number(idRemove),
          Number(idAdmin),
          res,
        );
      }
    }
  }

  @Patch(':channelid/switchToPrivate/:idAdmin')
  async switchToPrivate(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Body() body: ChannelSwitchToPrivate,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.switchToPrivate(
          Number(idChan),
          Number(idAdmin),
          body,
          res,
        );
      }
    }
  }

  @Patch(':channelid/switchToPublic/:idAdmin')
  async switchToPublic(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.switchToPublic(
          Number(idChan),
          Number(idAdmin),
          res,
        );
      }
    }
  }

  @Post(':channelid/sendMessage/:idUser')
  async sendMessage(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
    @Body() body: ChannelSendMsgDto,
  ): Promise<Message | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.sendMessage(
          Number(idChan),
          Number(idUser),
          res,
          body,
        );
      }
    }
  }

  @Delete(':channelid/removeMessage/:idMessage/:idUser')
  async removeMessage(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idMessage') idMessage: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ): Promise<Message | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.removeMessage(
          Number(idChan),
          Number(idMessage),
          Number(idUser),
          res,
        );
      }
    }
  }

  @Patch(':channelid/editMessage/:idMessage/:idUser')
  async editMessage(
    @Req() req: Request,
    @Param('channelid') idChan: number,
    @Param('idMessage') idMessage: number,
    @Param('idUser') idUser: number,
    @Body() body: ChannelSendMsgDto,
    @Res() res: Response,
  ): Promise<Message | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.editMessage(
          Number(idChan),
          Number(idMessage),
          Number(idUser),
          body,
          res,
        );
      }
    }
  }

  @Patch('banUser/')
  async banUser(
    @Req() req: Request,
    @Body() body: BanOrMuteUserDto,
    @Res() res: Response,
  ): Promise<Channel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        if ((body.Sanction == 'ban')) {
          return await this.channelService.banUser(body, res);
        } else {
          return await this.channelService.muteUser(body, res);
        }
      }
    }
  }

  @Get('Sanction/:channelID')
  async getSanction(
    @Req() req: Request,
    @Param('channelID') idChan: number,
    @Res() res: Response,
    ): Promise<BanModel[] | null> {
      if (req.headers.authorization) {
        const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
        if (user) {
          return await this.channelService.getSanction(
            Number(idChan),
            res
          )
        }
      }
    }

  @Delete('Sanction/:idSanction')
  async rmSanction(
    @Req() req: Request,
    @Param('idSanction') id: number,
    @Res() res: Response,
  ): Promise<BanModel | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.channelService.rmSanction(
          Number(id),
          res
        )
      }
    }
  }
}