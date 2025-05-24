import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async add(@Body() dto: CreateCommentDto) {
    return this.commentsService.addComment(dto.userId, dto.postId, dto.content);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.updateComment(id, dto.content);
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }
}
