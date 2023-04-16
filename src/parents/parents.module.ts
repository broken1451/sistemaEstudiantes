import { Module, forwardRef } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Parent, ParentShema } from './entities/parent.entity';
import { StudentModule } from '../student/student.module';

@Module({
  controllers: [ParentsController],
  providers: [ParentsService],
  imports: [
    AuthModule, 
    ConfigModule,
    forwardRef(() => StudentModule),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentShema, collection: 'parents' }])
  ],
  exports: [MongooseModule, ParentsService]
})
export class ParentsModule {}
