import { Module } from "@nestjs/common";
import { auth_controller } from "./auth.controller";
import { auth_service } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    imports : [JwtModule.register({})],
    controllers : [auth_controller],
    providers : [auth_service,JwtStrategy]
})
export class auth_module {}