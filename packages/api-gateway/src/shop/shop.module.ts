import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
  controllers: [ShopController,HttpModule],
  providers: [ShopService],
})
export class ShopModule {}
