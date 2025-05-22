import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(Favorite.name) private favoriteModel: Model<Favorite>) {}

  async addFavorite(userId: string, postId: string): Promise<Favorite> {
    const favorite = new this.favoriteModel({ userId: new Types.ObjectId(userId), postId: new Types.ObjectId(postId) });
    return favorite.save();
  }

  async removeFavorite(id: string): Promise<Favorite | null> {
    return this.favoriteModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findOne(id: string): Promise<Favorite | null> {
    return this.favoriteModel.findById(new Types.ObjectId(id)).exec();
  }

  async findAllByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }
}