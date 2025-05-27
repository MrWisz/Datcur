import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { Post } from '../posts/schemas/post.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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
      const secureUrl = await this.cloudinaryService.uploadImageFromBuffer(imageBuffer);

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          foto_perfil: secureUrl,
          gustos,
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      return updatedUser;
    } catch (error) {
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
      delete updateData.password;
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
    // id: usuario a seguir (perfil visitado)
    // userId: usuario logueado (quiere seguir al "id")

    // 1. Agrega "id" a seguidos del usuario logueado
    const followerUser = await this.findOne(userId);
    if (!followerUser.seguidos.includes(new Types.ObjectId(id))) {
      followerUser.seguidos.push(new Types.ObjectId(id));
      await followerUser.save();
    }

    // 2. Agrega "userId" a seguidores del usuario visitado
    const followedUser = await this.findOne(id);
    if (!followedUser.seguidores.includes(new Types.ObjectId(userId))) {
      followedUser.seguidores.push(new Types.ObjectId(userId));
      await followedUser.save();
    }

    return followedUser;
  }

  async unfollow(id: string, userId: string): Promise<User> {
    // id: usuario a dejar de seguir (perfil visitado)
    // userId: usuario logueado (quiere dejar de seguir al "id")

    // 1. Remueve "id" de seguidos del usuario logueado
    const followerUser = await this.findOne(userId);
    followerUser.seguidos = followerUser.seguidos.filter(
      (followedId) => !followedId.equals(new Types.ObjectId(id))
    );
    await followerUser.save();

    // 2. Remueve "userId" de seguidores del usuario visitado
    const unfollowedUser = await this.findOne(id);
    unfollowedUser.seguidores = unfollowedUser.seguidores.filter(
      (followerId) => !followerId.equals(new Types.ObjectId(userId))
    );
    await unfollowedUser.save();

    return unfollowedUser;
  }

  async getFollowers(id: string): Promise<User[]> {
    const user = await this.findOne(id);
    return this.userModel.find({ _id: { $in: user.seguidores } }).exec();
  }

  async getFollowing(id: string): Promise<User[]> {
    const user = await this.findOne(id);
    return this.userModel.find({ _id: { $in: user.seguidos } }).exec();
  }

  async searchUsersByUsernameOrName(query: string): Promise<User[]> {
    if (!query || !query.trim()) return [];
    const regex = new RegExp(query, 'i');
    return this.userModel.find({
      $or: [{ username: regex }, { nombre: regex }],
    }).exec();
  }

  async getProfileWithPosts(userId: string) {
    console.log("🧪 getProfileWithPosts() → userId recibido:", userId);
    let objectId: Types.ObjectId;

    try {
      objectId = new Types.ObjectId(userId);
    } catch (err) {
      throw new BadRequestException("ID de usuario inválido");
    }

    const user = await this.userModel
      .findById(userId)
      .select('nombre gustos foto_perfil')
      .exec();

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const posts = await this.postModel
      .find({ usuario_id: new Types.ObjectId(userId) })
      .sort({ fecha_creacion: -1 })
      .exec();

    return { user, posts };
  }
}
