import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateWalletDto {
    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    blockchain: string;
    
    @IsOptional()
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsString()
    label?: string;
}
