import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  private readonly cloudinaryService: CloudinaryService,) {}

  async updatePhoto(userId: string, imageUrl: string) {
    const secureUrl = await this.cloudinaryService.uploadImage(imageUrl);
    return this.userModel.findByIdAndUpdate(userId, {
      foto_perfil: secureUrl,
    }, { new: true });
  }

  async create(createUserDto: CreateUserDto): Promise<{ userId: string }> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

  const createdUser = new this.userModel({
    ...createUserDto,
    password_hash: hashedPassword,
  });

  const savedUser = await createdUser.save();

  return { userId: (savedUser._id as Types.ObjectId).toString() };
}

async configureUser(userId: string, imageBuffer: Buffer, gustos: string[]): Promise<User> {
  try {
    console.log('🔧 Iniciando configuración de usuario...');
    console.log('User ID:', userId);
    console.log('Gustos:', gustos);

    const secureUrl = await this.cloudinaryService.uploadImageFromBuffer(imageBuffer);
    console.log('✅ Imagen subida con URL:', secureUrl);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        foto_perfil: secureUrl,
        gustos,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('❌ Usuario no encontrado con ID:', userId);
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    console.log('✅ Usuario actualizado correctamente');
    return updatedUser;
  } catch (error) {
    console.error("❌ Error en configureUser:", error);
    throw new InternalServerErrorException('Error al guardar la configuración');
  }
}



async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(id)).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData: any = { ...updateUserDto };
  
    if (updateUserDto.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateUserDto.password, saltRounds);
      updateData.password_hash = hashedPassword;
      delete updateData.password; // Eliminar campo no usado en el schema
    }
  
    const updatedUser = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updateData,
      { new: true }
    ).exec();
  
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    return updatedUser;
  }  

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async follow(id: string, userId: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user.seguidos.includes(new Types.ObjectId(userId))) {
      user.seguidos.push(new Types.ObjectId(userId));
      await user.save();
    }
    const followedUser = await this.findOne(userId);
    if (!followedUser.seguidores.includes(new Types.ObjectId(id))) {
      followedUser.seguidores.push(new Types.ObjectId(id));
      await followedUser.save();
    }
    return user;
  }

  async unfollow(id: string, userId: string): Promise<User> {
    const user = await this.findOne(id);
    user.seguidos = user.seguidos.filter(followedId => !followedId.equals(new Types.ObjectId(userId)));
    await user.save();
    const unfollowedUser = await this.findOne(userId);
    unfollowedUser.seguidores = unfollowedUser.seguidores.filter(followerId => !followerId.equals(new Types.ObjectId(id)));
    await unfollowedUser.save();
    return user;
  }

  async getFollowers(id: string): Promise<User[]> {
    const user = await this.findOne(id);
    return this.userModel.find({ _id: { $in: user.seguidores } }).exec();
  }

  async getFollowing(id: string): Promise<User[]> {
    const user = await this.findOne(id);
    return this.userModel.find({ _id: { $in: user.seguidos } }).exec();
  }
}
