import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { PaginationDto, CurrentUser } from '@pharmacy-management-system/common';

@ApiTags('shops')
@Controller('shops')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shops (paginated)' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.shopService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  async findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shop' })
  async create(@Body() createShopDto: CreateShopDto, @CurrentUser() user) {
    return this.shopService.create(createShopDto, user);
  }

  @Get('owner/my-shops')
  @ApiOperation({ summary: 'Get shops owned by current user' })
  async getMyShops(@CurrentUser() user, @Query() paginationDto: PaginationDto) {
    return this.shopService.findByOwner(user.id, paginationDto);
  }
}