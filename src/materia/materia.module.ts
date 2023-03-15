import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Materia, MateriaShema } from './entities/materia.entity';

@Module({
  controllers: [MateriaController],
  providers: [MateriaService],
  imports: [
    AuthModule, 
    ConfigModule,
    MongooseModule.forFeature([{ name: Materia.name, schema: MateriaShema, collection: 'materias' }])
  ]
})
export class MateriaModule {}
