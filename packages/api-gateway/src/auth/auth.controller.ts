import { Controller, Post, Body, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { CurrentUser } from '@pharmacy-management-system/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
  ) {}

  private getAuthServiceUrl(): string {
    return this.configService.get('AUTH_SERVICE_URL', 'http://localhost:3001');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const response = await lastValueFrom(
          this.httpService.post(`${this.getAuthServiceUrl()}/auth/register`, registerDto)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Registration failed',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const response = await lastValueFrom(
          this.httpService.post(`${this.getAuthServiceUrl()}/auth/login`, loginDto)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Login failed',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user) {
    return { user };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate JWT token' })
  async validateToken(@Body('token') token: string) {
    try {
      const response = await lastValueFrom(
          this.httpService.post(`${this.getAuthServiceUrl()}/auth/validate`, { token })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
          error.response?.data?.message || 'Token validation failed',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}