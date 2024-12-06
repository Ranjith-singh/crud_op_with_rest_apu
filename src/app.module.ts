import { Module } from '@nestjs/common';
import { auth_module } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

// "@Module" is a decorator that adds metadata to the cuurent class
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal :true,
  }),auth_module, UserModule, BookmarkModule, PrismaModule]
})
export class AppModule {}
