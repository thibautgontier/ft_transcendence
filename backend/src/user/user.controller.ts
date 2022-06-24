import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Res,
  Delete,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { Response } from 'express';
import { UserUpdateDto } from './dto/user-update.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(@Query() query?: UserFilterDto): Promise<User[]> {
    return this.userService.getAll(query);
  }

  @Get('id/:id')
  async findID(@Param('id') id: number): Promise<User | null> {
    return await this.userService.findID(Number(id));
  }

  @Get('token/:token')
  async findToken(@Param('token') token: string): Promise<User | null> {
    return await this.userService.findToken(token);
  }

  // @Get('filter')
  // async getByFilter(@Query() query?: UserFilterDto): Promise<User[]> {
  //   return await this.userService.getByFilter(query.status, query.twoFA);
  // }

  @Post('create')
  async createUser(
    @Res() res: Response,
    @Body() postData: { token: string; refresh_token: string },
  ): Promise<User | null> {
    return await this.userService.createUser(
      res,
      postData.token,
      postData.refresh_token,
    );
  }

  @Delete('delete/:id')
  async deleteUser(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<User | null> {
    return await this.userService.deleteUser(res, Number(id));
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: UserUpdateDto,
  ): Promise<User | null> {
    return await this.userService.updateUser(Number(id), body);
  }
}
