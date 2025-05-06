import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto, usuario_id: string): Promise<Post> {
    try {
      const createdPost = new this.postModel({
        ...createPostDto,
        usuario_id: new Types.ObjectId(usuario_id),
        fecha_creacion: createPostDto.fecha_creacion ?? new Date(),
        likes: [],
        comentarios: [],
        favoritos: [],
      });
      return await createdPost.save();
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw new BadRequestException('Error al crear el post. Verifica los datos enviados.');
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(new Types.ObjectId(id)).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const { comentarios, ...allowedFields } = updatePostDto;

    const updatedPost = await this.postModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      allowedFields,
      { new: true }
    ).exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return updatedPost;
  }

  async remove(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return deletedPost;
  }

  async addComment(
    id: string,
    comment: { usuario_id: string; comentario: string; fecha_comentario: Date }
  ): Promise<Post> {
    const post = await this.findOne(id);
    post.comentarios.push({
      ...comment,
      usuario_id: new Types.ObjectId(comment.usuario_id),
      _id: new Types.ObjectId(),
    });
    return post.save();
  }

  async removeComment(id: string, commentId: string): Promise<Post> {
    const post = await this.findOne(id);
    post.comentarios = post.comentarios.filter(
      (comment) => !comment._id.equals(new Types.ObjectId(commentId))
    );
    return post.save();
  }
}
