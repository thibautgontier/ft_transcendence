import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { ChannelService } from './channel.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

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
    @Body() body : ChannelCreateDto): Promise<Channel | null> {
    return await this.channelService.createChannel(body);
  }
}
