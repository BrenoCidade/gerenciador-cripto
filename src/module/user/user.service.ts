import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password } = createUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER" as const,
            },
        });
    }

    async updateUserRole(userId: string, updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
        const data = { ...updateRoleUserDto };

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`user with ID ${userId} not found`);
        }

        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const data = { ...updateUserDto };

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`user with ID ${userId} not found`);
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async getUserById(userId: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`user with ID ${userId} not found`);
        }

        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async deleteUser(userId: string) {
        return this.prisma.user.delete({
            where: { id: userId }
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException(`user with email ${email} not found`);
        }

        return user;
    }
}
