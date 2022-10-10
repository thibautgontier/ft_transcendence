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
import { Channel, logStatus, User } from '@prisma/client';
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
import { UseInterceptors, UploadedFile } from  '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { extname } from  'path';

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

  @Get('channel/:userID')
  async getChannel(
  @Res() res: Response,
  @Param('userID') userID: number,
  ): Promise < User | null > {
    return await this.userService.getChannel(res, Number(userID));
  }

  @Get('otherChannel/:userID')
  async getOtherChannel(
  @Res() res: Response,
  @Param('userID') userID: number,
  ): Promise < Channel[] | null > {
    return await this.userService.getOtherChannel(res, Number(userID));
  }

  @Get(':userID')
  async getUser(
  @Res() res: Response,
  @Param('userID') userID: number,
  ): Promise < User | null > {
    return await this.userService.getUser(res, Number(userID));
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
    @Body() body: any,
    @Res() res: Response,
  ): Promise<User | null> {
    const user = await this.authService.findUser(
      req.headers.authorization.split(' ')[1],
    );
    return await this.userService.updateUserNickname(user, body.newNickname, res);
  }

  @Patch('updateAvatar')
  async updateUserAvatar(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<User | null> {
    const user = await this.authService.findUser(
      req.headers.authorization.split(' ')[1],
    );
    return await this.userService.updateUserAvatar(user, body.newAvatar, res);
  }

  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('avatar', { 
    storage: diskStorage({
      destination: UserService.destinationPath,
      filename: UserService.customFileName,
    }),
  }))
  async uploadAvatar(
    @UploadedFile() file: any,
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
    ): Promise<User | null> {
      const user = await this.authService.findUser(
        req.headers.authorization.split(' ')[1],
      );
    return await this.userService.updateUserAvatar(user, file, res);
  }

  @Get('avatars/:fileId')
  async serveAvatar(@Param('fileId') fileId: any, @Res() res: any): Promise<any> {
    return (res.sendFile(fileId, { root: 'avatars'}));
  }
}
