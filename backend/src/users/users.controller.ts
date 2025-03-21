import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  @Post(':id/seguir')
  async follow(@Param('id') id: string, @Body('userId') userId: string): Promise<User> {
    return this.usersService.follow(id, userId);
  }

  @Post(':id/dejar-de-seguir')
  async unfollow(@Param('id') id: string, @Body('userId') userId: string): Promise<User> {
    return this.usersService.unfollow(id, userId);
  }

  @Get(':id/seguidores')
  async getFollowers(@Param('id') id: string): Promise<User[]> {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/seguidos')
  async getFollowing(@Param('id') id: string): Promise<User[]> {
    return this.usersService.getFollowing(id);
  }
}