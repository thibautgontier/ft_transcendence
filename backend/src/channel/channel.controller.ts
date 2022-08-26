import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
import { ChannelSwitchToPrivate } from './dto/channel-swicthToPrivate.dto';
import { ChannelUpdateDto } from './dto/channel-update.dto';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  async getAll() {
    return this.channelService.getAll();
  }

  @Get('id/:id')
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

  @Patch(':channelid/kick/:idKicker/:idToKick')
  async kickUser(
    @Param('channelid') idChan: number,
    @Param('idKicker') idKicker: number,
    @Param('idToKick') idToKick: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.kickUser(
      Number(idChan),
      Number(idKicker),
      Number(idToKick),
      res,
    );
  }

  @Patch(':channelid/switchToPrivate/:idAdmin')
  async switchToPrivate(
    @Param('channelid') idChan: number,
    @Param('idAdmin') idAdmin: number,
    @Body() body: ChannelSwitchToPrivate,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.switchToPrivate(
      Number(idChan),
      Number(idAdmin),
      body,
      res,
    );
  }
}
