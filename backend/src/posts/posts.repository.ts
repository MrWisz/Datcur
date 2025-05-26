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

  /*async getPostsPaginated(paginationParameters: PaginationParameters): Promise<PostDocument[]> {
    return this.PostsModel.find(
      {},
      {},
      {
        lean: true,
        sort: {
          postsDate: -1,
        },
        ...paginationParameters,
      },
    ).exec();
  }*/

  async getPostsPaginated({
    limit,
    skip,
  }: PaginationParameters): Promise<PostDocument[]> {
    return this.PostsModel
      .find()
      .sort({ fecha_creacion: -1 }) 
      .skip(skip || 0)
      .limit(limit || 2)
      .populate('usuario_id', 'nombre username foto_perfil') 
      .lean() 
      .exec();
  }

  async countPosts(): Promise<number> {
    return this.PostsModel.countDocuments({});
  }
}
