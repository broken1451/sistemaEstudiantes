import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentShema } from './entities/student.entity';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    AuthModule, 
    ConfigModule,
    MongooseModule.forFeature([{ name: Student.name, schema: StudentShema, collection: 'students' }])
  ]
})
export class StudentModule {}
