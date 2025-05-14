import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async addLike(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.addLike(createLikeDto.userId, createLikeDto.postId);
  }

  @Delete(':id')
  async removeLike(@Param('id') id: string) {
    return this.likesService.removeLike(id);
  }
}