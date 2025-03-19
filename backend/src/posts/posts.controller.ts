import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<PostModel[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostModel> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.remove(id);
  }

  @Post(':id/comentarios')
  async addComment(@Param('id') id: string, @Body() comment: { usuario_id: string; comentario: string; fecha_comentario: Date }): Promise<PostModel> {
    return this.postsService.addComment(id, comment);
  }

  @Delete(':id/comentarios/:commentId')
  async removeComment(@Param('id') id: string, @Param('commentId') commentId: string): Promise<PostModel> {
    return this.postsService.removeComment(id, commentId);
  }
}