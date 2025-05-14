import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFavoriteDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}