import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Express } from 'express';
import { PaginationParameters } from './dto/pagination-parameters.dto';
import { PostsRepository } from './posts.repository';
import { PostDocument } from './schemas/post.schema';
import util from 'util';

function ensureObjectIdArray(array?: any[]): Types.ObjectId[] {
  if (!Array.isArray(array)) return [];
  return array.map(id => (id instanceof Types.ObjectId ? id : new Types.ObjectId(id)));
}


@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly postsRepository: PostsRepository,
  ) { }

  async create(
    createPostDto: CreatePostDto,
    usuario_id: string,
  ): Promise<PostDocument> {
    try {
      // 👇 Convierte favoritos/likes si vienen del frontend (opcional pero recomendado)
      const favoritos = createPostDto['favoritos']
        ? ensureObjectIdArray(createPostDto['favoritos'])
        : [];
      const likes = createPostDto['likes']
        ? ensureObjectIdArray(createPostDto['likes'])
        : [];
      const createdPost = new this.postModel({
        ...createPostDto,
        usuario_id: new Types.ObjectId(usuario_id),
        fecha_creacion: createPostDto.fecha_creacion ?? new Date(),
        likes,
        comentarios: [],
        favoritos,
      });
      return await createdPost.save();
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw new BadRequestException(
        'Error al crear el post. Verifica los datos enviados.',
      );
    }
  }

  async createPostWithImages(
    body: any,
    images: Express.Multer.File[],
    usuario_id: string,
  ): Promise<PostDocument> {
    try {
      const fotos: string[] = [];

      for (const file of images) {
        const imageUrl = await this.cloudinaryService.uploadImageFromBuffer(
          file.buffer,
        );
        fotos.push(imageUrl);
      }

      const post = new this.postModel({
        descripcion: body.descripcion,
        etiquetas: JSON.parse(body.etiquetas || '[]'),
        fotos,
        usuario_id: new Types.ObjectId(usuario_id),
        fecha_creacion: new Date(),
        likes: [],
        comentarios: [],
        favoritos: [],
      });

      return await post.save();
    } catch (err) {
      console.error('❌ Error al crear el post con imágenes:', err);
      throw new InternalServerErrorException('No se pudo crear el post');
    }
  }

  async findOne(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(new Types.ObjectId(id)).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(
  id: string,
  updatePostDto: UpdatePostDto,
): Promise<PostDocument> {
  const { descripcion, fotos, etiquetas, comentarios } = updatePostDto;
  const allowedFields: any = {};
  if (descripcion !== undefined) allowedFields.descripcion = descripcion;
  if (fotos !== undefined) allowedFields.fotos = fotos;
  if (etiquetas !== undefined) allowedFields.etiquetas = etiquetas;
  if (comentarios !== undefined) allowedFields.comentarios = comentarios;

  const updatedPost = await this.postModel
    .findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: allowedFields },
      { new: true, runValidators: true }
    )
    .exec();

  if (!updatedPost) throw new NotFoundException(`Post with ID ${id} not found`);
  return updatedPost;
}




  async remove(id: string): Promise<PostDocument> {
    const deletedPost = await this.postModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return deletedPost;
  }

  async addComment(
    id: string,
    comment: { usuario_id: string; comentario: string; fecha_comentario: Date },
  ): Promise<PostDocument> {
    const post = await this.findOne(id);
    post.comentarios.push({
      ...comment,
      usuario_id: new Types.ObjectId(comment.usuario_id),
      _id: new Types.ObjectId(),
    });
    return post.save();
  }

  async removeComment(id: string, commentId: string): Promise<PostDocument> {
    const post = await this.findOne(id);
    post.comentarios = post.comentarios.filter(
      (comment) => !comment._id.equals(new Types.ObjectId(commentId)),
    );
    return post.save();
  }

  async findAllWithLikedFlag(userId: string): Promise<any[]> {
    const posts = await this.postModel
      .find()
      .populate('usuario_id')
      .lean(); // convierte a objetos JS puros

    return posts.map((post) => ({
      ...post,
      liked: post.likes?.some((id) => id.toString() === userId),
    }));
  }

  async getPostsPaginated(
    paginationParameters: PaginationParameters,
  ): Promise<PostDocument[]> {
    return this.postsRepository.getPostsPaginated(paginationParameters);
  }

  async countPosts(params?: PaginationParameters): Promise<number> {
    return this.postsRepository.countPosts(params);
  }
}
