import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(createFavoriteDto.userId, createFavoriteDto.postId);
  }

  @Delete(':id')
  async removeFavorite(@Param('id') id: string) {
    return this.favoritesService.removeFavorite(id);
  }
}