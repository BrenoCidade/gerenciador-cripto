import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAssetDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    symbol: string;

    @IsNotEmpty()
    @IsNumber()
    balance: number;

    @IsNotEmpty()
    @IsString()
    walletId: string;

    @IsOptional()
    @IsNumber()
    currentPrice?: number;

    @IsOptional()
    @IsNumber()
    totalValue?: number;
}