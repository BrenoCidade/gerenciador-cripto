import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAssetDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    symbol?: string;

    @IsOptional()
    @IsNumber()
    balance?: number;

    @IsOptional()
    @IsString()
    walletId?: string;

    @IsOptional()
    @IsNumber()
    currentPrice?: number;

    @IsOptional()
    @IsNumber()
    totalValue?: number;
}