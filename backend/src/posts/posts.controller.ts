import {
  Controller,
  Post as HttpPost,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { PostDocument } from './schemas/post.schema';
//import { Post } from './schemas/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PaginationParameters } from './dto/pagination-parameters.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por imagen
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ): Promise<PostDocument> {
    const usuario_id = req.user?.['userId'];
    if (!usuario_id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.postsService.createPostWithImages(body, images, usuario_id);
  }

  @Get('count')
async countPosts(@Query() params: PaginationParameters): Promise<number> {
  return this.postsService.countPosts(params);
}


  /*@Get(':id')
  async findAll(@Req() req: Request): Promise<PostDocument[]> {
    const userId = req.user?.['userId'];
    return this.postsService.findAllWithLikedFlag(userId);
  }*/

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostDocument> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostDocument> {
    return this.postsService.remove(id);
  }

  @Get()
  async getPostsPaginated(
    @Query() getPostsParameters: PaginationParameters,
  ): Promise<PostDocument[]> {
    console.log("Query completa recibida:", getPostsParameters);
    return this.postsService.getPostsPaginated(getPostsParameters);
  }
}
