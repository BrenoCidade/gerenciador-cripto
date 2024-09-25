import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';


export class CreateWalletDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    blockchain: string;
    
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsString()
    label?: string;
}