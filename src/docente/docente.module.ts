import { Module, forwardRef } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Docente, DocenteShema } from './entities/docente.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MateriaModule } from 'src/materia/materia.module';

@Module({
  controllers: [DocenteController],
  providers: [DocenteService],
  imports: [ 
    AuthModule, 
    ConfigModule,
    // forwardRef(() => MateriaModule),
    forwardRef(() => MateriaModule),
    MongooseModule.forFeature([{ name: Docente.name, schema: DocenteShema, collection: 'docentes' }])
  ],
  exports: [DocenteService]
})
export class DocenteModule {}
