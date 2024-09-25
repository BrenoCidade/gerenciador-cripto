import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { Role } from '../../auth/role/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { Roles } from 'src/auth/decorators/roler.decorator';
import { Public } from '../../auth/decorators/is-public.decorator';
import { RolesGuard } from 'src/auth/role/roles.guard';

@Public()
@UseGuards(JwtAuthGuard)
@Controller('users')                                
export class UserController {
    constructor (private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User>  {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    async findAll(): Promise<User[]>  {
        return this.userService.getAllUsers();
    }

    @Get(':userId')
    async findById(@Param('userId') userId: string): Promise<User | null>  {
        return this.userService.getUserById(userId);
    }
    
    @Put(':userId')
    async updateById(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(userId, updateUserDto);
    }

    @Roles(Role.Admin)
    @Put('/role/:userId')
    async updateUserRoleById(@Param('userId') userId: string, @Body() updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
        return this.userService.updateUserRole(userId, updateRoleUserDto);
    }

    @Delete(':userId')
    async delete(@Param('userId') userId: string) {
        return this.userService.deleteUser(userId);
    }
}
