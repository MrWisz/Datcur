import { Controller, Post, Delete, Param, Body, Get, NotFoundException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(createFavoriteDto.userId, createFavoriteDto.postId);
  }

  @Delete(':id')
  async removeFavorite(@Param('id') id: string) {
    const favorite = await this.favoritesService.removeFavorite(id);
    if (!favorite) {
      throw new NotFoundException(`Favorito con ID "${id}" no encontrado`);
    }
    return favorite;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const favorite = await this.favoritesService.findOne(id);
    if (!favorite) {
      throw new NotFoundException(`Favorito con ID "${id}" no encontrado`);
    }
    return favorite;
  }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.favoritesService.findAllByUserId(userId);
  }
}