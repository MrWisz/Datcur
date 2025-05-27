import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ userId: string }> {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(@Query('query') query: string): Promise<User[]> {
    return this.usersService.searchUsersByUsernameOrName(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/profile-with-posts')
  async getProfileWithPosts(@Param('id') id: string) {
    return this.usersService.getProfileWithPosts(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/seguir')
  async follow(
    @Param('id') id: string,
    @Body('userId') userId: string
  ): Promise<User> {
    return this.usersService.follow(id, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/dejar-de-seguir')
  async unfollow(
    @Param('id') id: string,
    @Body('userId') userId: string
  ): Promise<User> {
    return this.usersService.unfollow(id, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/seguidores')
  async getFollowers(@Param('id') id: string): Promise<User[]> {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/seguidos')
  async getFollowing(@Param('id') id: string): Promise<User[]> {
    return this.usersService.getFollowing(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id/configure')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )

  @UseGuards(JwtAuthGuard)
  async configureUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('gustos') gustosJson: string,
  ): Promise<User> {
    const gustos = JSON.parse(gustosJson);
    const updated = await this.usersService.configureUser(
      id,
      file.buffer,
      gustos,
    );
    return updated as User;
  }

  @Post(':id/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const imageUrl = await this.cloudinaryService.uploadImage(file.path);
    await this.usersService.update(id, { foto_perfil: imageUrl });

    return { imageUrl };
  }
}
