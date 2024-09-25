import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';


export class UpdateRoleUserDto {
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}