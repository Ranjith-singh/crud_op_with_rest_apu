import { describe } from "node:test";
// import * as NetsTesting from '@nestjs/testing'
import {Test} from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum'
import { AuthDto } from "../src/auth/dto";

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
  });
  // console.log(NetsTesting)
  it.todo('should pass')
  afterAll(async ()=>{
      app.close()
  })
  describe('Auth',()=>{
    describe('Signup',()=>{
      it('should signup with auth',()=>{
        const dto : AuthDto = {
          email : "example@gmail.com",
          password : "123"
        }
        return pactum
        .spec()
        .post(`http://localhost:3333/auth/signup`)
        .withBody(dto)
        .expectStatus(201)
        .inspect()

      })
    })
    describe('login',()=>{
      
    })
  })

  describe('User',()=>{
    describe('get me',()=>{

    })
    describe('edit user',()=>{
      
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