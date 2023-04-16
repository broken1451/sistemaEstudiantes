import { Module, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentShema } from './entities/student.entity';
import { NotasModule } from 'src/notas/notas.module';
import { ParentsModule } from '../parents/parents.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    AuthModule, 
    ConfigModule,
    forwardRef(() => NotasModule),
    forwardRef(() => ParentsModule),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentShema, collection: 'students' }])
  ],
  exports: [StudentService, MongooseModule]
})
export class StudentModule {}
