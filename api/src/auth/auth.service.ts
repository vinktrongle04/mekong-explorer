import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    // Note: DTO labels it 'passwordHash' as earlier scaffold, assuming plain text password is provided here from client
    const user = await this.validateUser(loginDto.email, loginDto.passwordHash);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password input (assumes CreateUserDto 'passwordHash' maps to plain text here as well)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, saltRounds);

    // Save with hashed password
    const newUser = await this.usersService.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    };
  }
}
