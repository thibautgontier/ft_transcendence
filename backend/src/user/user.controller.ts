import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Res,
  Req,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { logStatus, User } from '@prisma/client';
import { UserService } from './user.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { Response, Request } from 'express';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FtOauthGuard } from 'src/auth/guards/ft-oauth.guard';
import { Student } from 'src/auth/user.decorator';
import { Profile } from 'passport';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @ApiQuery({ name: 'id', type: Number, required: false })
  @ApiQuery({ name: 'token', type: Number, required: false })
  @ApiQuery({ name: 'status', enum: logStatus, required: false })
  @ApiQuery({ name: 'twoFA', type: Boolean, required: false })
  @ApiQuery({ name: 'gameProfile', type: Boolean, required: false })
  @ApiQuery({ name: 'socialProfile', type: Boolean, required: false })
  async getAll(@Query() query?: UserFilterDto): Promise<User[]> {
    return await this.userService.getAll(query);
  }

  @Get('create')
  @UseGuards(FtOauthGuard)
  async createUser(
    @Res() res: Response,
    @Student() body: Profile,
  ): Promise<User | null> {
    return await this.userService.createUser(res, body);
  }

  @Delete('delete/:userID')
  async deleteUser(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<User | null> {
    return await this.userService.deleteUser(res, Number(userID));
  }

  @Patch('update/:userID')
  async updateUser(
    @Param('userID') userID: number,
    @Body() body: UserUpdateDto,
  ): Promise<User | null> {
    return await this.userService.updateUser(Number(userID), body);
  }

  @Patch('updateNickname')
  async updateUserNickname(
    @Req() req: Request,
    @Body() body: string,
    @Res() res: Response,
  ): Promise<User | null> {
    const user = await this.authService.findUser(
      req.headers.authorization.split(' ')[1],
    );
    return await this.userService.updateUserNickname(user, body, res);
  }

  @Patch('updateNickname')
  async updateUserAvatar(
    @Req() req: Request,
    @Body() body: string,
    @Res() res: Response,
  ): Promise<User | null> {
    const user = await this.authService.findUser(
      req.headers.authorization.split(' ')[1],
    );
    return await this.userService.updateUserAvatar(user, body, res);
  }
}
