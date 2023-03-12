import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, Document } from 'mongoose';

@Schema()
export class Student extends Document  {

    
    @Prop({ required: [true, "El nro_identidad necesario y unico"], type: String })
    nro_identidad: string;

    @Prop({ required: [false], type: String }) 
    name_student: string;

    @Prop({ required: [false], type: String })
    lastname_student: string;

    @Prop({ required: [true, "La f_nacimiento necesario"], type: Date  })
    f_nacimiento: Date

    @Prop({ required: [false], type: String })
    sexo: string;

    @Prop({ required: [false], type: String })
    jornada: string;

    @Prop({ required: [false], type: String })
    direccion: string;

    @Prop({ required: [false], type: Number })
    telefono: number;

    @Prop({ type: Date, default: Date.now })
    created: Date

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: String, default: '' })
    img: string;
}


export const StudentShema = SchemaFactory.createForClass(Student);