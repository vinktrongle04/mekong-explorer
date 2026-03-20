import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
