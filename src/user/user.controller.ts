import { Controller, Get, Req , Patch , UseGuards, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('/users')
export class UserController {
    constructor(private userServive : UserService){
    }
    @Get('/me')
    getme(@GetUser() user : User,@GetUser('email') email : String)
    {
        console.log({
            user : user,
            email,
        });
        return user;
    }

    @Patch('/edit')
    edit_user(
        @GetUser('id') userId : number,
        @Body() dto : EditUserDto 
    ){
        // console.log('user_con_dto : ',userId,dto)
        return this.userServive.edit_user(userId,dto); 
    }
}
