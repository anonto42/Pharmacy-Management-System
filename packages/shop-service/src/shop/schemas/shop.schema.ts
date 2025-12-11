import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '@pharmacy-management-system/common';

export type ShopDocument = Shop & Document;

@Schema({ timestamps: true })
export class Shop {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    ownerId: string;

    @Prop({ required: true })
    ownerEmail: string;

    @Prop({ type: [String], enum: Role, default: [Role.SHOP_KEEPER] })
    allowedRoles: Role[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: [] })
    products: string[];

    @Prop()
    location: string;

    @Prop()
    contactPhone: string;

    @Prop()
    contactEmail: string;

    @Prop({ type: Object })
    metadata: Record<string, any>;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

// Indexes
ShopSchema.index({ ownerId: 1 });
ShopSchema.index({ name: 'text', description: 'text' });