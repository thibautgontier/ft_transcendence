import { Controller, Get, Param } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { ChannelService } from './channel.service';

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
}
