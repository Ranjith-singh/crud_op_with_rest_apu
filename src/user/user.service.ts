import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService : PrismaService){}
    async edit_user(userId :number, dto : EditUserDto){
        // console.log('dto : ',dto)
        const user= await this.prismaService.user.update({
            where : {
                id : userId,
            },
            data : {
                ...dto,
            }
        });
        delete user.hash;
        // console.log(user);

        return user;
    }
}
