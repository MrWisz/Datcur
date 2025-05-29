import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  Put,
  UseGuards,
  Req,
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
  async add(@Body() dto: CreateCommentDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.commentsService.addComment(userId, dto.postId, dto.content);
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

  /*//maneja los comentarios
  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: { comentario: string },
    @Req() req: Request,
  ): Promise<PostDocument> {
    await this.postsService.addComment(id, { comentario: body.comentario });
    return this.postsService.findOne(id);
} */
}
