import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Token } from './schemas/token.schema';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async create(createTokenDto: CreateTokenDto): Promise<Token> {
    const createdToken = new this.tokenModel(createTokenDto);
    return createdToken.save();
  }

  async findAll(): Promise<Token[]> {
    return this.tokenModel.find().exec();
  }

  async findOne(id: string): Promise<Token> {
    const token = await this.tokenModel.findById(new Types.ObjectId(id)).exec();
    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
    return token;
  }

  async update(id: string, updateTokenDto: UpdateTokenDto): Promise<Token> {
    const updatedToken = await this.tokenModel.findByIdAndUpdate(new Types.ObjectId(id), updateTokenDto, { new: true }).exec();
    if (!updatedToken) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
    return updatedToken;
  }

  async remove(id: string): Promise<Token> {
    const deletedToken = await this.tokenModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
    if (!deletedToken) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
    return deletedToken;
  }
}