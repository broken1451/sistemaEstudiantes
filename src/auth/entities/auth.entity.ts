import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Auth extends Document {
    // roles ADMIN, DOCENTE, ESTUDIANTE, PARENTS

    @Prop({ required: [true, "El nombre es necesario y unico"], type: String })
    name: string;

    @Prop({required: [false, "El correo es necesario y unico"], type: String })
    email: string;

    @Prop({ type: String, default: '' })
    img: string;

    @Prop({required: [false, "El username es necesario"], type: String, default: '' })
    username: string;

    @Prop({required: [false, "El nro_identity es necesario"], type: String, default: '' })
    nro_identity: string;

    @Prop({ required: [true, "El password es necesario"], type: String })
    password: string;

    @Prop({ type: Array, default: ['ADMIN'] })
    roles: string[];

    @Prop({ type: Date, default: Date.now })
    created: Date;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Number, default: 0 })
    retry: number;
}

export const UserShema = SchemaFactory.createForClass(Auth);