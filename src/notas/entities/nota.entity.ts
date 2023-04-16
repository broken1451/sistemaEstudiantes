import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, Document } from 'mongoose';
import { Materia } from 'src/materia/entities/materia.entity';
import { Student } from 'src/student/entities/student.entity';

@Schema()
export class Nota extends Document  {


    @Prop({ required: [true, 'La note necesario'], type: String })
    note: string;

    @Prop({
        required: [true, 'El estudiante es necesario'],
        type: SchemaTypes.ObjectId,
        ref: `${Student.name}`,
    })
    student: Types.ObjectId;

    @Prop({
        required: [true, 'La materia es necesario'],
        type: SchemaTypes.ObjectId,
        ref: `${Materia.name}`,
    })
    materia: Types.ObjectId;

}

export const NotaShema = SchemaFactory.createForClass(Nota);