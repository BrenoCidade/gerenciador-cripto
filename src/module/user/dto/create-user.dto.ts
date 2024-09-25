
import { Role } from '@prisma/client';
import { IsString, IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role
}