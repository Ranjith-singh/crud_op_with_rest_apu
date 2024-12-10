import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: String | undefined, ctx: ExecutionContext) => {
    const request : Express.Request = ctx.switchToHttp().getRequest();
    if(data){
        // console.log("data : ",data)
        return request.user[data.toString()]
    }
    return request.user;
  },
);