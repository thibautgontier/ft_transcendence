import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findID(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async findToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { token: token } });
  }

  async getManyFiltered(id: number, token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id, token: token } });
  }
}
