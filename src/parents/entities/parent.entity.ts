import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, Document } from 'mongoose';
import { Student } from 'src/student/entities/student.entity';

@Schema()
export class Parent extends Document {

    @Prop({ required: [true, 'El name necesario'], type: String })
    name: string;

    @Prop({ required: [true, 'El lastName necesario'], type: String })
    lastName: string;

    @Prop({
        required: [true, 'El estudiante es necesario'],
        type: SchemaTypes.ObjectId,
        ref: `${Student.name}`,
    })
    student: Types.ObjectId;
}

export const ParentShema = SchemaFactory.createForClass(Parent);