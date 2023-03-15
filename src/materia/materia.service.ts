import { Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Materia } from './entities/materia.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MateriaService {
  
  constructor(
    @InjectModel(Materia.name) private readonly materiaModel: Model<Materia>,
    private readonly configService: ConfigService,
  ) {}

  async create(createMateriaDto: CreateMateriaDto) {
    let { nombre_materia, ...rest } = createMateriaDto;
    nombre_materia = nombre_materia.toLowerCase().trim();

    const materia = await this.materiaModel.create({
      nombre_materia,
      ...rest,
    });

    return materia;
  }

  async findAll(desde: string = '0') {
    const materias = await this.materiaModel
      .find({})
      .skip(Number(desde))
      .limit(5)
      .populate('docente', '-_id')
      .sort({ created: 1 });
    const countsMaterias = await this.materiaModel.countDocuments({});
    return { materias, countsMaterias };
  }

  async findMateriasByTeacher(desde: string = '0', idDocente: string) {
    const materias = await this.materiaModel
      .find({docente:idDocente})
      .skip(Number(desde))
      .limit(5)
      .populate('docente', '-_id')
      .sort({ created: 1 });
    const countsMaterias = await this.materiaModel.countDocuments({docente: idDocente});
    return { materias ,countsMaterias };
  }

  findOne(id: number) {
    return `This action returns a #${id} materia`;
  }

  update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return `This action updates a #${id} materia`;
  }

  remove(id: number) {
    return `This action removes a #${id} materia`;
  }
}
