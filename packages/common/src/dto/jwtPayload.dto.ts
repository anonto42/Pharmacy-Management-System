import {Role} from "@my-microservices/common/enums/role.enum";

export interface JwtPayload {
    sub: string;
    email: string;
    roles: Role[];
    iat?: number;
    exp?: number;
}