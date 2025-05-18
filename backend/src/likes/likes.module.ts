import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like, LikeSchema } from './schemas/like.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema'; 


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema },
      { name: Post.name, schema: PostSchema },]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}