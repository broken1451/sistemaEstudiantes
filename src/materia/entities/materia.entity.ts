import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, Document } from 'mongoose';
import { Docente } from '../../docente/entities/docente.entity';

@Schema()
export class Materia extends Document {
    
  @Prop({ required: [true, 'El nombre_materia necesario'], type: String })
  nombre_materia: string;

  @Prop({
    required: [true, 'El docente necesario'],
    type: SchemaTypes.ObjectId,
    ref: `${Docente.name}`,
  })
  docente: Types.ObjectId;
}

export const MateriaShema = SchemaFactory.createForClass(Materia);
