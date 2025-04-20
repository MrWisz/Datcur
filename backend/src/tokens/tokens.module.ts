import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])
  ],
  providers: [TokensService],
  controllers: [TokensController]
})
export class TokensModule {}