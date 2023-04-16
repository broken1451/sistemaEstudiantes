import { Module, forwardRef } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Materia, MateriaShema } from './entities/materia.entity';
import { DocenteModule } from '../docente/docente.module';
import { NotasModule } from 'src/notas/notas.module';

@Module({
  controllers: [MateriaController],
  providers: [MateriaService],
  imports: [
    AuthModule, 
    ConfigModule,
    forwardRef(() => DocenteModule),
    forwardRef(() => NotasModule),
    MongooseModule.forFeature([{ name: Materia.name, schema: MateriaShema, collection: 'materias' }])
  ],
  exports: [MateriaService, MongooseModule]
})
export class MateriaModule {}
