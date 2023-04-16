import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Materia } from './entities/materia.entity';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Docente } from '../docente/entities/docente.entity';
import { DocenteService } from 'src/docente/docente.service';

@Injectable()
export class MateriaService {
  
  constructor(
    @InjectModel(Materia.name) private readonly materiaModel: Model<Materia>,
    // @InjectModel(Docente.name) private readonly docenteModel: Model<Docente>,
    @Inject(forwardRef(() => DocenteService)) private readonly docenteService: DocenteService,
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

  async findMateriasByTeacher(desde: string = '0', idDocente: string,  name_materia: string) {

    let expRegular = new RegExp(name_materia,'i');
    const materias = await this.materiaModel
      .find({$or: [{docente:idDocente},{nombre_materia: expRegular}]})
      .skip(Number(desde))
      .limit(5)
      .populate('docente', '-_id')
      .sort({ created: 1 });
    const countsMaterias = await this.materiaModel.countDocuments({docente: idDocente});
    return { materias ,countsMaterias };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }

    const materia = await this.materiaModel
      .find({'_id': id})
      .limit(1)
      .populate('docente', '-_id');

    if (materia.length == 0) {
      throw new BadRequestException(`La materia con ${id} no existe`);
    }

    return { materia };
  }

  async update(id: string, updateMateriaDto: UpdateMateriaDto) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    

    const materiaUpdated = await this.materiaModel.findByIdAndUpdate(id, updateMateriaDto, {new: true}).populate('docente', '-_id');
    if (!materiaUpdated) {
      throw new BadRequestException(`La materia con el id ${id} no existe`);
    }
    
    return materiaUpdated;
  }



  async remove(id: string) {
    const materia = await this.findOne(id);
    const materiaDeleted = await this.materiaModel.findByIdAndDelete(id, materia);
    return true;
  }
}
