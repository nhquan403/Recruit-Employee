import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const BCRYPT_SALT_ROUNDS = 10;

interface CreateUserInput {
  email: string;
  password: string;
  role: Extract<Role, 'CANDIDATE' | 'EMPLOYER'>;
  fullName: string;
  phone?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
        fullName: input.fullName,
        phone: input.phone,
        ...(input.role === 'CANDIDATE' ? { profile: { create: {} } } : {}),
      },
    });
  }
}
