import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Global()
@Injectable()
export class PrismaService extends PrismaClient{
    constructor(private config:ConfigService){
        super({
            datasources : {
                db:{
                    url : config.get('DATABASE_URL')
                }
            }
        });
        // console.log(config.get('DATABASE_URL'))
    }
    cleanDB()
    {
        this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany(),
        ])
    }
}
