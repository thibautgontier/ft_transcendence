import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Channel[]> {
    return this.prisma.channel.findMany();
  }

  async findID(id: number): Promise<Channel | null> {
  return this.prisma.channel.findUnique({ where : {id: id}});
  }

  async createChannel(body : ChannelCreateDto): Promise<Channel | null> {
    const channel = await this.prisma.channel.create({
      data: {
        
      }
    })
  }
}
