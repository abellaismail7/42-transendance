import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDtoType } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { authenticator } from 'otplib';

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

  async findOneById(id: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async fulfillTfa(id: string, tfaCode: string): Promise<User> {
    const user = await this.findOneById(id);
    if (user) {
      if (process.env.TWOFA_KEY === undefined) {
        throw new Error('TFA secret not found');
      }
      const isTfaValid = authenticator.check(tfaCode, process.env.TWOFA_KEY);
      if (isTfaValid) {
        const updatedUser: User = await this.prisma.user.update({
          where: { id },
          data: { TwoFAcode: tfaCode },
        });
        return updatedUser;
      }
      throw new Error('Invalid TFA code');
    }
    throw new Error(`User with id ${id} not found`);
  }

  async update(id: string, updateUserDto: UpdateUserDtoType): Promise<User> {
    const user = await this.findOneById(id);
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
    const user = await this.findOneById(id);
    if (user) {
      await this.prisma.user.delete({
        where: { id },
      });
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }
}
