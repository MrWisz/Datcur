import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async addComment(
    userId: string,
    postId: string,
    content: string,
  ): Promise<Comment> {
    try {
      console.log('Entrando a addComment:', { userId, postId, content });

      const comment = new this.commentModel({
        usuario_id: new Types.ObjectId(userId),
        publicacion_id: new Types.ObjectId(postId),
        comentario: content,
        fecha_comentario: new Date(),
      });

      console.log('Nuevo comentario a guardar:', comment);

      const saved = await comment.save();

      console.log('Comentario guardado:', saved);

      const updateResult = await this.postModel.updateOne(
        { _id: postId },
        { $push: { comentarios: saved._id } },
      );

      console.log('Resultado de updateOne en post:', updateResult);

      return saved;
    } catch (error) {
      console.error('Error en addComment:', error);
      throw error;
    }
  }

  /*async addComment(
      id: string,
      comment: { comentario: string },
    ): Promise<PostDocument> {
      try {
        console.log('Entrando a addComment', id, comment);
  
        const post = await this.findOne(id);
        if (!post) throw new NotFoundException('Post no encontrado');
  
        // Solo el texto del comentario
        console.log('Comentario a agregar:', comment.comentario);
  
        post.comentarios.push(comment.comentario);
  
        console.log('Comentarios antes de guardar:', post.comentarios);
        console.log('Post antes de guardar:', JSON.stringify(post, null, 2));
  
        return await post.save();
      } catch (error) {
        console.error('Error en addComment:', error);
        throw new InternalServerErrorException(
          'No se pudo agregar el comentario: ' + error.message,
        );
      }
    } */

  /*async removeComment(id: string, commentText: string): Promise<PostDocument> {
    const post = await this.findOne(id);
    post.comentarios = post.comentarios.filter(
      (comment) => comment !== commentText,
    );
    return post.save();
  } */

  async deleteComment(id: string): Promise<Comment | null> {
    const comment = await this.commentModel.findByIdAndDelete(id).exec();

    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }

    try {
      await this.postModel.updateOne(
        { _id: comment.publicacion_id },
        { $pull: { comentarios: { _id: comment._id } } },
        { bypassDocumentValidation: true },
      );
    } catch (err) {
      console.error(
        '⚠️ Falló al actualizar el post al eliminar el comentario embebido:',
        err,
      );
      // No abortamos la operación porque el comentario ya fue eliminado de la colección principal
    }

    return comment;
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    const comment = await this.commentModel.findByIdAndUpdate(
      id,
      { comentario: content },
      { new: true },
    );

    if (!comment) throw new NotFoundException('Comentario no encontrado');

    return comment;
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ publicacion_id: new Types.ObjectId(postId) })
      .exec();
  }
}
