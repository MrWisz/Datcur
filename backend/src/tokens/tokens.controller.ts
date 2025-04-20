import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Token } from './schemas/token.schema';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  async create(@Body() createTokenDto: CreateTokenDto): Promise<Token> {
    return this.tokensService.create(createTokenDto);
  }

  @Get()
  async findAll(): Promise<Token[]> {
    return this.tokensService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Token> {
    return this.tokensService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto): Promise<Token> {
    return this.tokensService.update(id, updateTokenDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Token> {
    return this.tokensService.remove(id);
  }
}