import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { auth_service } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('/auth')
export class auth_controller {
    constructor(private auth_service:auth_service){}

    @Post('/hi')
    hi(){
        return "hello"
    }
    
    @Post('/signup')
    signup(@Body() dto : AuthDto){
        console.log({
            dto,
        })
        return this.auth_service.signup(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    login(@Body() dto : AuthDto){
        return this.auth_service.login(dto)
    }
}