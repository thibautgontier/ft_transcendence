import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

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
    @Body() body : ChannelCreateDto):
    Promise<Channel | null> {
    return await this.channelService.createChannel(res, body);
  }
}
