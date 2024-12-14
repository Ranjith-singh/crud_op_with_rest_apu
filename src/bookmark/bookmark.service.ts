import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkById } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) { }
    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data : {
                UserID : userId,
                ...dto,
            }
        })
        return bookmark
    }

    async getBookmarks(userId: number) {
        return await this.prisma.bookmark.findMany({
            where : {
                UserID : userId,
            }
        })
    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        return await this.prisma.bookmark.findFirst({
            where : {
                id : bookmarkId,
            }
        })
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkById) {
        const bookmarks = await this.prisma.bookmark.findFirst({
            where : {
                id : bookmarkId,
            }
        })
        if(!bookmarks || bookmarks.UserID != userId)
        {
            throw new ForbiddenException(`bookmark doesn't exists or user doesn't have the authorization`)
        }
        return await this.prisma.bookmark.update({
            where : {
                id : bookmarkId,
            },
            data : {
                ...dto,
            }
        })
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmarks = await this.prisma.bookmark.findFirst({
            where : {
                id : bookmarkId,
            }
        })
        if(!bookmarks || bookmarks.UserID != userId)
        {
            throw new ForbiddenException(`bookmark doesn't exists or user doesn't have the authorization`)
        }
        return await this.prisma.bookmark.delete({
            where : {
                id : bookmarkId,
            }
        })
    }
}
