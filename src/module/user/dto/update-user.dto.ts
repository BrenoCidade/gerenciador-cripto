import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';


export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
    
    @MinLength(6)
    @IsOptional()
    password?: string;
}