import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { ChannelAddUserDto } from './dto/channel-addUser.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
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

  @Patch('update/:id')
  async updateChannel(
    @Param('id') id: number,
    @Body() body: ChannelUpdateDto,
  ): Promise<Channel | null> {
    return await this.channelService.updateChannel(Number(id), body);
  }

  @Patch('addUser/:id')
  async addUser(
    @Param('id') id:number,
	@Res() res: Response,
    @Body() body: ChannelAddUserDto,
  ): Promise<Channel | null> {
	return await this.channelService.addUser(Number(id), res, body);
  }
}
