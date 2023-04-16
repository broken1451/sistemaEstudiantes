import { Module, forwardRef } from '@nestjs/common';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Nota, NotaShema } from './entities/nota.entity';
import { StudentModule } from 'src/student/student.module';
import { MateriaModule } from 'src/materia/materia.module';

@Module({
  controllers: [NotasController],
  providers: [NotasService],
  imports: [
    AuthModule, 
    ConfigModule,
    forwardRef(() => StudentModule),
    forwardRef(() => MateriaModule),
    MongooseModule.forFeature([{ name: Nota.name, schema: NotaShema, collection: 'notas' }])
  ]
})
export class NotasModule {}
