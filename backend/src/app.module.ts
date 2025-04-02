import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultdb', {
      connectionFactory: (connection: Connection) => {
        connection.once('open', () => {
          console.log('Connected to MongoDB Atlas');
        });
        connection.on('error', (err) => {
          console.error('Error connecting to MongoDB Atlas:', err);
        });
        return connection;
      },
    }),
    UsersModule,
    PostsModule,
    TokensModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}