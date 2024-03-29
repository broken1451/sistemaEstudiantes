import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { DocenteModule } from './docente/docente.module';
import { StudentModule } from './student/student.module';
import { MateriaModule } from './materia/materia.module';
import { NotasModule } from './notas/notas.module';
import { ParentsModule } from './parents/parents.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
    }),
    AuthModule,
    DocenteModule,
    StudentModule,
    MateriaModule,
    NotasModule,
    ParentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
