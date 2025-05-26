import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';
import { Post } from '../posts/schemas/post.schema';


@Injectable()
export class FavoritesService {
  constructor(
  @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  @InjectModel(Post.name) private postModel: Model<Post> 
) {}


async addFavorite(userId: string, postId: string): Promise<Favorite> {
  const existing = await this.favoriteModel.findOne({
    userId: new Types.ObjectId(userId),
    postId: new Types.ObjectId(postId),
  });

  if (existing) return existing;

  const favorite = new this.favoriteModel({
    userId: new Types.ObjectId(userId),
    postId: new Types.ObjectId(postId),
  });

  const savedFavorite = await favorite.save();

  await this.postModel.updateOne(
    { _id: postId },
    { $addToSet: { favoritos: userId } },
    { bypassDocumentValidation: true }
  );

  return savedFavorite;
}

  async removeFavorite(id: string): Promise<Favorite | null> {
  const favorite = await this.favoriteModel.findById(id).exec();
  if (!favorite) return null;

  await this.postModel.updateOne(
    { _id: favorite.postId },
    { $pull: { favoritos: new Types.ObjectId(favorite.userId) } },
    { bypassDocumentValidation: true }
  );

  return this.favoriteModel.findByIdAndDelete(id).exec();
}


  async findOne(id: string): Promise<Favorite | null> {
    return this.favoriteModel.findById(new Types.ObjectId(id)).exec();
  }

  async findAllByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ userId: new Types.ObjectId(userId) })
    .populate('postId')
    .exec();
  }
}