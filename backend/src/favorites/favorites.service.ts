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
) {console.log(">>> FavoritesService INICIALIZADO");}


async addFavorite(userId: string, postId: string): Promise<Favorite> {
  // Convierte a ObjectId de la forma más segura posible
  const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
  const postObjectId = Types.ObjectId.isValid(postId) ? new Types.ObjectId(postId) : postId;

  // 🔥 LOGS PARA DEBUG FINAL
  console.log('typeof userObjectId:', typeof userObjectId, userObjectId);
  console.log('userObjectId instanceof Types.ObjectId:', userObjectId instanceof Types.ObjectId);
  console.log('userObjectId constructor name:', userObjectId.constructor.name);

  // El resto de tu método igual
  const existing = await this.favoriteModel.findOne({
    userId: userObjectId,
    postId: postObjectId,
  });

  if (existing) return existing;

  const favorite = new this.favoriteModel({
    userId: userObjectId,
    postId: postObjectId,
  });

  const savedFavorite = await favorite.save();

  await this.postModel.updateOne(
    { _id: postObjectId },
    { $addToSet: { favoritos: userObjectId } }
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