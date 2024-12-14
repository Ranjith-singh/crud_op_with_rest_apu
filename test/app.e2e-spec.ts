import { describe } from "node:test";
// import * as NetsTesting from '@nestjs/testing'
import {Test} from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum'
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto, EditBookmarkById } from "src/bookmark/dto";

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
    describe('get empty bookmarks',()=>{
      it('should return empty',()=>{
        return pactum
        .spec()
        .get('/Bookmarks')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .inspect()
      })
    })
    describe('Create bookmark',()=>{
      it('should create bookmark',()=>{
        const dto : CreateBookmarkDto={
          title : 'freecodecamp',
          link : 'https://www.youtube.com/watch?v=GHTA143_b-s&list=PPSV',
        }
        return pactum
        .spec()
        .post('/Bookmarks')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(201)
        .stores('BookmarkId','id')
        .inspect()
      })
    })

    describe('get bookmarks',()=>{
      it('should return array of bookmarks',()=>{
        return pactum
        .spec()
        .get('/Bookmarks')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .inspect()
        .expectJsonLength(1)
      })
    })

    describe('get bookmark by id',()=>{
      it('should return bookmark by id',()=>{
        return pactum
        .spec()
        .get('/Bookmarks/{id}')
        .withPathParams('id','$S{BookmarkId}')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{BookmarkId}')
        .inspect()
      })
    })
    describe('Edit bookmark',()=>{
      it('should return bookmark by id',()=>{
        const dto : EditBookmarkById={
          title : 'NestJs Course for Beginners',
          description : 'Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques'
        }
        return pactum
        .spec()
        .patch('/Bookmarks/{id}')
        .withPathParams('id','$S{BookmarkId}')
        .withBody(dto)
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains(dto.title)
        .inspect()
      })
    })
    describe('delete bookmark',()=>{
      it('should return bookmark by id',()=>{
        return pactum
        .spec()
        .delete('/Bookmarks/{id}')
        .withPathParams('id','$S{BookmarkId}')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .expectStatus(204)
        .inspect()
      })
      it('should return empty bookmarks',()=>{
        return pactum
        .spec()
        .get('/Bookmarks')
        .withHeaders({
          Authorization : 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectJsonLength(0)
        .inspect()
      })
    })
  })
})