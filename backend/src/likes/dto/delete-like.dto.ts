import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteLikeDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}