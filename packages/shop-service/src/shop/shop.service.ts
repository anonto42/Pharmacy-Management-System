import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from './schemas/shop.schema';
import { CreateShopDto } from './dto/create-shop.dto';
import { PaginationDto, PaginatedResponse, Role } from '@pharmacy-management-system/common';

@Injectable()
export class ShopService {
  constructor(
      @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async create(createShopDto: CreateShopDto, user: any): Promise<Shop> {
    const shop = new this.shopModel({
      ...createShopDto,
      ownerId: user.id,
      ownerEmail: user.email,
      allowedRoles: [Role.SHOP_KEEPER, Role.SUB_ADMIN, Role.SUPER_ADMIN],
    });

    return shop.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<Shop>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      this.shopModel
          .find({ isActive: true })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
      this.shopModel.countDocuments({ isActive: true }).exec(),
    ]);

    return new PaginatedResponse(shops, total, page, limit);
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopModel.findById(id).exec();
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    return shop;
  }

  async findByOwner(ownerId: string, paginationDto: PaginationDto): Promise<PaginatedResponse<Shop>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      this.shopModel
          .find({ ownerId })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
      this.shopModel.countDocuments({ ownerId }).exec(),
    ]);

    return new PaginatedResponse(shops, total, page, limit);
  }

  async update(id: string, updateData: Partial<Shop>): Promise<Shop> {
    const shop = await this.shopModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    return shop;
  }

  async remove(id: string): Promise<void> {
    const result = await this.shopModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
  }

  async searchShops(query: string, paginationDto: PaginationDto): Promise<PaginatedResponse<Shop>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      this.shopModel
          .find({ $text: { $search: query }, isActive: true })
          .skip(skip)
          .limit(limit)
          .exec(),
      this.shopModel.countDocuments({ $text: { $search: query }, isActive: true }).exec(),
    ]);

    return new PaginatedResponse(shops, total, page, limit);
  }
}