import { Controller, Get, Param, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from '@pharmacy-management-system/common';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
  ) {}

  private getUserServiceUrl(): string {
    return this.configService.get('USER_SERVICE_URL', 'http://localhost:3002');
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (paginated)' })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const response = await lastValueFrom(
          this.httpService.get(`${this.getUserServiceUrl()}/users`, {
            params: paginationDto,
          })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Failed to fetch users',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
          this.httpService.get(`${this.getUserServiceUrl()}/users/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'User not found',
          error.response?.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}