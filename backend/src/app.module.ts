import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module'; // Importar LikesModule
import { FavoritesModule } from './favorites/favorites.module'; // Importar FavoritesModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'mongoose';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI as string, {
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
    AuthModule,
    LikesModule,
    FavoritesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}