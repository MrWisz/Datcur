import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './schemas/like.schema';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>
  ) {}

  async addLike(userId: string, postId: string): Promise<Like> {
  const userObjectId = new Types.ObjectId(userId);
  const postObjectId = new Types.ObjectId(postId);

  const like = new this.likeModel({
    userId: userObjectId,
    postId: postObjectId,
  });

  const savedLike = await like.save();

  await this.postModel.updateOne(
    { _id: postObjectId },
    { $addToSet: { likes: userObjectId } },
    { bypassDocumentValidation: true } 
  );

  return savedLike;
}

  async removeLike(id: string): Promise<Like | null> {
    const like = await this.likeModel.findById(id).exec();
    if (!like) return null;

    await this.postModel.updateOne(
      { _id: like.postId },
      { $pull: { likes: like.userId } }
    );

    return this.likeModel.findByIdAndDelete(id).exec();
  }
}
