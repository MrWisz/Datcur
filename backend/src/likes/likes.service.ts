import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './schema/like.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<Like>) {}

  async addLike(userId: string, postId: string): Promise<Like> {
    const like = new this.likeModel({ userId: new Types.ObjectId(userId), postId: new Types.ObjectId(postId) });
    return like.save();
  }

  async removeLike(id: string): Promise<Like | null> {
    return this.likeModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}