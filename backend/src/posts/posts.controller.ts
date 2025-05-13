import { Controller, Post, Body, Req, UseGuards, Get, Param, Put, Delete, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { Query } from '@nestjs/common';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostModel> {
    const usuario_id = req.user?.['userId'];
    if (!usuario_id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.postsService.create(createPostDto, usuario_id);
  }

  @Get()
  async getPaginatedPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: PostModel[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.postsService.getPaginatedPosts(+page, +limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostModel> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.remove(id);
  }
}
