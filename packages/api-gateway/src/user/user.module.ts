import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
  controllers: [UserController,HttpModule],
  providers: [UserService],
})
export class UserModule {}
