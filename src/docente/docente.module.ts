import { Module } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Docente, DocenteShema } from './entities/docente.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [DocenteController],
  providers: [DocenteService],
  imports: [ 
    AuthModule, 
    ConfigModule,
    MongooseModule.forFeature([{ name: Docente.name, schema: DocenteShema, collection: 'docentes' }])
  ],
})
export class DocenteModule {}
