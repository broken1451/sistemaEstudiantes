import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, Document } from 'mongoose';

@Schema()
export class Docente extends Document  {

    @Prop({ required: [true, "El nro_identidad necesario y unico"], type: String })
    nro_identidad: string;

    @Prop({ required: [true, "El name_teacher es requerido"], type: String })
    name_teacher: string;

    @Prop({ required: [false, "El lastname_teacher es requerido"], type: String })
    lastname_teacher: string;

    @Prop({ required: [true], type: Array, default: [] })
    speciality_teacher: string[];

    @Prop({ type: Date, default: Date.now })
    created: Date

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Date, default: Date.now })
    updated: Date;

    @Prop({ type: String, default: '' })
    img: string;
}

export const DocenteShema = SchemaFactory.createForClass(Docente);