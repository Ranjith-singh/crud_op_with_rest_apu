import { describe } from "node:test";
// import * as NetsTesting from '@nestjs/testing'
import {Test} from "@nestjs/testing";
import { AppModule } from "../src/app.module";
// import { PrismaService } from "src/prisma/prisma.service";

describe('app e2e',()=>{
  beforeAll(async ()=>{
      const module_ref = await Test.createTestingModule({
        imports : [AppModule],
      }).compile();
  });
  // console.log(NetsTesting)
  it.todo('should pass')
})