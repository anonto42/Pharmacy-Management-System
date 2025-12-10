import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Role } from '@pharmacy-management-system/common';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    email: string;

    @Column({ unique: true })
    @Index()
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        array: true,
        default: [Role.USER],
    })
    roles: Role[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}