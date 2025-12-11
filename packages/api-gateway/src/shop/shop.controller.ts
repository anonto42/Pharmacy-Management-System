import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CreateShopDto } from './dto/create-shop.dto';
import { PaginationDto, CurrentUser } from '@pharmacy-management-system/common';

@ApiTags('shops')
@Controller('shops')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ShopController {
  constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
  ) {}

  private getShopServiceUrl(): string {
    return this.configService.get('SHOP_SERVICE_URL', 'http://localhost:3003');
  }

  @Get()
  @ApiOperation({ summary: 'Get all shops (paginated)' })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const response = await lastValueFrom(
          this.httpService.get(`${this.getShopServiceUrl()}/shops`, {
            params: paginationDto,
          })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Failed to fetch shops',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
          this.httpService.get(`${this.getShopServiceUrl()}/shops/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Shop not found',
          error.response?.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shop' })
  async create(@Body() createShopDto: CreateShopDto, @CurrentUser() user) {
    try {
      const response = await lastValueFrom(
          this.httpService.post(`${this.getShopServiceUrl()}/shops`, createShopDto, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Failed to create shop',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('owner/my-shops')
  @ApiOperation({ summary: 'Get shops owned by current user' })
  async getMyShops(@CurrentUser() user, @Query() paginationDto: PaginationDto) {
    try {
      const response = await lastValueFrom(
          this.httpService.get(`${this.getShopServiceUrl()}/shops/owner/my-shops`, {
            params: paginationDto,
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Failed to fetch your shops',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}