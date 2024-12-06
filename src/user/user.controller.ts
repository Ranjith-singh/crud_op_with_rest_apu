import { Controller, Get, Req , Patch , UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    
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
    edit_me(){

    }
}
