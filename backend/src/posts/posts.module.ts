import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CloudinaryModule,
  ],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
})
export class PostsModule {}