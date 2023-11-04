import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDtoType } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    const users: User[] = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDtoType): Promise<User> {
    const user: User = await this.findOne(id);
    if (user) {
      const updatedUser: User = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    }
    throw new Error(`User with id ${id} not found`);
  }

  async remove(id: string): Promise<void> {
    const user: User = await this.findOne(id);
    if (user) {
      await this.prisma.user.delete({
        where: { id },
      });
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }
}
