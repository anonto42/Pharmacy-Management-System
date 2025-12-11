import { IsString, IsOptional, IsBoolean, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
    @ApiProperty({ example: 'My Awesome Shop' })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'A shop that sells awesome products', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ example: '123 Main St' })
    @IsString()
    location: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    contactPhone: string;

    @ApiProperty({ example: 'contact@shop.com' })
    @IsEmail()
    contactEmail: string;

    @ApiProperty({ example: true, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}