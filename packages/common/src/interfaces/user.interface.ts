import { Role } from '../enums/role.enum';

export interface User {
    id: string;
    email: string;
    username: string;
    roles: Role[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}