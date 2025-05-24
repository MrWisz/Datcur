import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        @InjectModel(Post.name) private postModel: Model<Post>
    ) { }

    async addComment(userId: string, postId: string, content: string): Promise<Comment> {
        const comment = new this.commentModel({
            usuario_id: new Types.ObjectId(userId),
            publicacion_id: new Types.ObjectId(postId),
            comentario: content,
            fecha_comentario: new Date(),
        });

        const saved = await comment.save();

        await this.postModel.updateOne(
            { _id: postId },
            {
                $push: {
                    comentarios: {
                        usuario_id: new Types.ObjectId(userId),
                        comentario: content,
                        fecha_comentario: saved.fecha_comentario,
                        _id: saved._id,
                    },
                },
            },
            { bypassDocumentValidation: true }
        );

        return saved;
    }

    async deleteComment(id: string): Promise<Comment | null> {
  const comment = await this.commentModel.findByIdAndDelete(id).exec();

  if (!comment) {
    throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
  }

  try {
    await this.postModel.updateOne(
      { _id: comment.publicacion_id },
      { $pull: { comentarios: { _id: comment._id } } },
      { bypassDocumentValidation: true }
    );
  } catch (err) {
    console.error('⚠️ Falló al actualizar el post al eliminar el comentario embebido:', err);
    // No abortamos la operación porque el comentario ya fue eliminado de la colección principal
  }

  return comment;
}


    async updateComment(id: string, content: string): Promise<Comment> {
        const comment = await this.commentModel.findByIdAndUpdate(
            id,
            { comentario: content },
            { new: true }
        );

        if (!comment) throw new NotFoundException('Comentario no encontrado');

        await this.postModel.updateOne(
            { _id: comment.publicacion_id, 'comentarios._id': comment._id },
            {
                $set: {
                    'comentarios.$.comentario': content,
                },
            },
            { bypassDocumentValidation: true }
        );

        return comment;
    }


    async findByPostId(postId: string): Promise<Comment[]> {
        return this.commentModel
            .find({ publicacion_id: new Types.ObjectId(postId) })
            .exec();
    }
}
