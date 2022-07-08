import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelCreatePrivDto } from './dto/channel-createPriv.dto';
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

  @Patch('update/:id')
  async updateChannel(
    @Param('id') id: number,
    @Body() body: ChannelUpdateDto,
  ): Promise<Channel | null> {
    return await this.channelService.updateChannel(Number(id), body);
  }

  @Patch('addUser/:id')
  async addUser(
    @Param('id') id_chan: number,
    @Res() res: Response,
    @Body() body: ChannelAddUserDto,
  ): Promise<Channel | null> {
    return await this.channelService.addUser(Number(id_chan), res, body);
  }

  @Patch(':Channelid/removeUser/:id')
  async removeUser(
    @Param('Channelid') idChan: number,
    @Param('id') idRemove: number,
    @Res() res: Response,
  ): Promise<Channel | null> {
    return await this.channelService.removeUser(
      Number(idChan),
      Number(idRemove),
      res,
    );
  }
}
