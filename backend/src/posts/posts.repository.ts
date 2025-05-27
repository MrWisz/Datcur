import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationParameters } from './dto/pagination-parameters.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostsModel: Model<PostDocument>,
  ) {}

  async getPostsPaginated({
    limit,
    skip,
    userId,
  }: PaginationParameters): Promise<PostDocument[]> {
    const query: any = {};
    if (userId) {
      try {
        query.usuario_id = new Types.ObjectId(userId);
      } catch {
        query.usuario_id = userId; // fallback
      }
    }
    console.log('🟠 QUERY DE POSTS:', query);
    return this.PostsModel
      .find(query)
      .sort({ fecha_creacion: -1 })
      .skip(skip || 0)
      .limit(limit || 10)
      .populate('usuario_id', 'nombre username foto_perfil')
      .lean()
      .exec();
  }

  async countPosts(params?: PaginationParameters): Promise<number> {
    const query: any = {};
    if (params?.userId) {
      try {
        query.usuario_id = new Types.ObjectId(params.userId);
      } catch {
        query.usuario_id = params.userId;
      }
    }
    return this.PostsModel.countDocuments(query);
  }
}
