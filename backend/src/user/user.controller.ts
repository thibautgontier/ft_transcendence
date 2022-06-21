import { Controller, Get, Param, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  async findID(@Param('id') id: number): Promise<User | null> {
    return await this.userService.findID(Number(id));
  }

  @Get(':token')
  async findToken(@Param('token') token: string): Promise<User | null> {
    return await this.userService.findToken(token);
  }

  @Get('filter')
  async getByFilter(
    @Query('id') id?: number,
    @Query('token') token?: string,
  ): Promise<User | null> {
    return await this.userService.getManyFiltered(id, token);
  }
}
