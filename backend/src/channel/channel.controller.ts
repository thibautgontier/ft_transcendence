import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel, Message } from '@prisma/client';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelSendMsgDto } from './dto/channel-sendMessage.dto';
import { ChannelSwitchToPrivateDto } from './dto/channel-swicthToPrivate.dto';
import { ChannelUpdateDto } from './dto/channel-update.dto';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  async getAll() {
    return this.channelService.getAll();
  }

  @Get(':id')
  async findID(@Param('id') id: number): Promise<Channel | null> {
    return await this.channelService.findID(Number(id));
  }

  @Post('create')
  async createChannel(
    @Res() res: Response,
    @Body() body: ChannelCreateDto,
  ): Promise<Channel | null> {
    return await this.channelService.createChannel(res, body);
  }

  @Delete(':channelid/delete/:idAdmin')
  async deleteChannel(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.deleteChannel(
      Number(idChan),
      Number(idAdmin),
      res,
    );
  }

  @Post('createPriv')
  async createPrivChannel(
    @Res() res: Response,
    @Body() body: ChannelCreatePrivDto,
  ): Promise<Channel | null> {
    return await this.channelService.createPrivChannel(res, body);
  }

  @Patch('update/:idChannel/:idAdmin')
  async updateChannel(
    @Param('idChannel') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Body() body: ChannelUpdateDto,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.updateChannel(
      Number(idChan),
      Number(idAdmin),
      body,
      res,
    );
  }

  @Patch('addUser/:id')
  async addUser(
    @Param('id') id_chan: number,
    @Res() res: Response,
    @Body() body: ChannelAddUserDto,
  ): Promise<Channel | null> {
    return await this.channelService.addUser(Number(id_chan), res, body);
  }

  @Patch(':channelid/removeUser/:id')
  async removeUser(
    @Param('channelid') idChan: number,
    @Param('id') idRemove: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.removeUser(
      Number(idChan),
      Number(idRemove),
      res,
    );
  }

  @Patch(':channelid/addAdmin/:idToAdd/:idAdmin')
  async addAdmin(
    @Param('channelid') idChan: number,
    @Param('idToAdd') idToAdd: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.addAdmin(
      Number(idChan),
      Number(idToAdd),
      Number(idAdmin),
      res,
    );
  }

  @Patch(':channelid/removeAdmin/:idRemove/:idAdmin')
  async removeAdmin(
    @Param('channelid') idChan: number,
    @Param('idRemove') idRemove: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.removeAdmin(
      Number(idChan),
      Number(idRemove),
      Number(idAdmin),
      res,
    );
  }

  @Patch(':channelid/switchToPrivate/:idAdmin')
  async switchToPrivate(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Body() body: ChannelSwitchToPrivateDto,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.switchToPrivate(
      Number(idChan),
      Number(idAdmin),
      body,
      res,
    );
  }

  @Patch(':channelid/switchToPublic/:idAdmin')
  async switchToPublic(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.switchToPublic(
      Number(idChan),
      Number(idAdmin),
      res,
    );
  }

  @Post(':channelid/sendMessage/:idUser')
  async sendMessage(
    @Param('channelid') idChan: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
    @Body() body: ChannelSendMsgDto,
  ): Promise<Message | null> {
    return await this.channelService.sendMessage(
      Number(idChan),
      Number(idUser),
      res,
      body,
    );
  }

  @Delete(':channelid/removeMessage/:idMessage/:idUser')
  async removeMessage(
    @Param('channelid') idChan: number,
    @Param('idMessage') idMessage: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ): Promise<Message | null> {
    return await this.channelService.removeMessage(
      Number(idChan),
      Number(idMessage),
      Number(idUser),
      res,
    );
  }

  @Patch(':channelid/editMessage/:idMessage/:idUser')
  async editMessage(
    @Param('channelid') idChan: number,
    @Param('idMessage') idMessage: number,
    @Param('idUser') idUser: number,
    @Body() body: ChannelSendMsgDto,
    @Res() res: Response,
  ): Promise<Message | null> {
    return await this.channelService.editMessage(
      Number(idChan),
      Number(idMessage),
      Number(idUser),
      body,
      res,
    );
  }

  @Patch(':channelid/muteUser/:idAdmin/:idUser')
  async muteUser(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.muteUser(
      Number(idChan),
      Number(idAdmin),
      Number(idUser),
      res,
    );
  }

  @Patch(':channelid/unmuteUser/:idAdmin/:idUser')
  async unmuteUser(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.unmuteUser(
      Number(idChan),
      Number(idAdmin),
      Number(idUser),
      res,
    );
  }

  @Patch(':channelid/banUser/:idAdmin/:idUser')
  async banUser(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.banUser(
      Number(idChan),
      Number(idAdmin),
      Number(idUser),
      res,
    );
  }

  @Patch(':channelid/unbanUser/:idAdmin/:idUser')
  async unbanUser(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.unbanUser(
      Number(idChan),
      Number(idAdmin),
      Number(idUser),
      res,
    );
  }
}
