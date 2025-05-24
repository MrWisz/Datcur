import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard) 
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

  @Get('by-user/:userId/post/:postId')
  async findByUserAndPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    return this.likesService.findLikeByUserAndPost(userId, postId);
  }
}
