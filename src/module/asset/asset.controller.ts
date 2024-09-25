import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from '@prisma/client';
import { Public } from 'src/auth/decorators/is-public.decorator';

@Public()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    @Post()
    async createAsset(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
        return this.assetService.createAsset(createAssetDto);
    }

    @Get()
    async findAllAssets(): Promise<Asset[]> {
        return this.assetService.findAllAssets();
    }
    
    @Get(':assetId')
    async findAssetById(@Param('assetId') assetId: string): Promise<Asset> {
        return this.assetService.findAssetById(assetId);
    }

    @Put(':assetId')
    async updateAsset(@Param('assetId') assetId: string, @Body() updateAssetDto: UpdateAssetDto): Promise<Asset> {
        return this.assetService.updateAsset(assetId, updateAssetDto);
    }

    @Delete(':assetId')
    async deleteAsset(@Param('assetId') assetId: string) {
        return this.assetService.deleteAsset(assetId);
    }
}
