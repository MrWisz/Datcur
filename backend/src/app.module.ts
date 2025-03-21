import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://100127067271ucla:gXurwe4tCaLhSdpx@cluster0.xksb0.mongodb.net/datcur?retryWrites=true&w=majority', {
      connectionFactory: (connection) => {
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}