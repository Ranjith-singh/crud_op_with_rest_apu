import { ForbiddenException, Injectable } from "@nestjs/common";
// import { User,Bookmark } from "@prisma/client";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class auth_service{
    constructor(
        private prisma:PrismaService,
        private jwt:JwtService,
        private config : ConfigService
    ){}
    user_login()
    {
        console.log("user login");
    }
    sign()
    {
        console.log("user signup");
    }
    async signup(dto : AuthDto){
        // return (this.login())
        const hash=await argon.hash(String(dto.password)); 
        // return {msg : "i am signed up"

        // save the user in the DB
        try{
            const user=await this.prisma.user.create({
                data : {
                    email : String(dto.email),
                    hash,
                }
            });
            delete user.hash;

            return this.signToken(user.id,user.email);
        }
        catch(error)
        {
            if(error instanceof PrismaClientKnownRequestError)
            {
                if(error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentails taken',
                    );
                }
            }
            throw error;
        }
    }

    async login(dto : AuthDto){
        // find user with email
        const user = await this.prisma.user.findUnique({
            where : {
                email : String(dto.email),
            },
        });
        if(!user)
        {
            throw new ForbiddenException('email not found')
        }

        // compare password
        const pw_matches =await argon.verify(user.hash,String(dto.password));

        if(!pw_matches)
        {
            throw new ForbiddenException('password does not match')
        }

        //return user

        delete user.hash;

        return this.signToken(user.id,user.email);
    }
    async signToken(userId : number,email : string) : Promise<{access_token : string}>
    {
        const payload={
            sub : userId,
            email,
        }
        const secret = this.config.get('JWT-SECRET');

        const token = await this.jwt.signAsync(payload,{
            expiresIn : '15m',
            secret : secret,
        });

        return {
            access_token : token,
        };
    }
}