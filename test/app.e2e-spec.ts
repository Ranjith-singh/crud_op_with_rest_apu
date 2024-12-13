import { describe } from "node:test";
// import * as NetsTesting from '@nestjs/testing'
import {Test} from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum'
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";

describe('app e2e',()=>{
  let app : INestApplication
  let prisma :PrismaService
  beforeAll(async ()=>{
      const module_ref = await Test.createTestingModule({
        imports : [AppModule],
      }).compile();
      app=await module_ref.createNestApplication()
      app.useGlobalPipes(new ValidationPipe({
        whitelist : true
      }))
      await app.init()
      await app.listen(3333)
      prisma = app.get(PrismaService)
      await prisma.cleanDB()
      pactum.request.setBaseUrl('http://localhost:3333')
  });
  // console.log(NetsTesting)
  it.todo('should pass')
  afterAll(async ()=>{
      app.close()
  })
  describe('Auth',()=>{
    const dto : AuthDto = {
      email : "example@gmail.com",
      password : "123"
    }
    describe('Signup',()=>{
      it('signup using email only using auth',()=>{
        return pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({
          email : dto.email,
        })
        .expectStatus(400)

      })
      it('signup using password only using auth',()=>{
        return pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({
          email : dto.password,
        })
        .expectStatus(400)

      })
      it('should signup with auth',()=>{
        return pactum
        .spec()
        .post(`/auth/signup`)
        .withBody(dto)
        .expectStatus(201)
        .inspect()
        .stores('userAt', 'access_token')
      })
    })
    describe('login',()=>{
      it('should login using auth',()=>{
        return pactum
        .spec()
        .post(`/auth/login`)
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token')
      })
      it('should login only with email using auth',()=>{
        return pactum
        .spec()
        .post(`/auth/login`)
        .withBody({
          email : dto.email,
        })
        .expectStatus(400)
      })
      it('should login only with password using auth',()=>{
        return pactum
        .spec()
        .post(`/auth/login`)
        .withBody({
          password : dto.password,
        })
        .expectStatus(400)
      })
    })
  })

  describe('User',()=>{
    describe('get me',()=>{
        it('shoild return user',()=>{
          return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization : 'Bearer $S{userAt}'
          })
          .expectStatus(200)
        })
    });
    describe('edit user',()=>{
      it('should edit user',()=>{
        const edit_dto : EditUserDto ={
          email : 'hello@gmail.com',
          firstName : 'example' 
        };
        // console.log("test : ",edit_dto);
        return pactum
        .spec()
        .patch('/users/edit')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}'
        })
        .withBody(edit_dto)
        .expectStatus(200)
        .inspect()
        .expectBodyContains('email')
        .expectBodyContains('createdAt')
      })
    })
  })

  describe('Bookmarks',()=>{
    describe('Create bookmark',()=>{

    })
    describe('get bookmarks',()=>{
      
    })
    describe('get bookmark by id',()=>{

    })
    describe('Edit bookmark',()=>{
      
    })
    describe('delete bookmark',()=>{
      
    })
  })
})