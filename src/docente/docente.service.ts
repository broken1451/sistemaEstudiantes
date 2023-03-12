import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Docente } from './entities/docente.entity';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DocenteService {
  constructor(
    @InjectModel(Docente.name) private readonly docenteModel: Model<Docente>,
    private readonly configService: ConfigService,
  ) {}

  async create(createDocenteDto: CreateDocenteDto) {
    let { name_teacher, lastname_teacher, nro_identidad, speciality_teacher, ...rest } = createDocenteDto;
    name_teacher = name_teacher.toLowerCase().trim();
    lastname_teacher = lastname_teacher.toLowerCase().trim();
    nro_identidad = nro_identidad.toLowerCase().trim();
    speciality_teacher = speciality_teacher.map((val) =>
      val.toLocaleLowerCase().trim(),
    );

    const docente = await this.docenteModel.create({
      name_teacher,
      lastname_teacher,
      nro_identidad,
      speciality_teacher,
      ...rest
    });
    return docente;
  }

  async findAll(desde: string = '0') {
    const docentes = await this.docenteModel
      .find({})
      .skip(Number(desde))
      .limit(5)
      .sort({ created: 1 });
    const countsDocentes = await this.docenteModel.countDocuments({});
    return { docentes, countsDocentes };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    const docenteDb = await this.docenteModel.findById(id);

    if (!docenteDb) {
      throw new BadRequestException(`El docente con el id ${id} no existe`);
    }
    return docenteDb;
  }

  async update(id: string, updateDocenteDto: UpdateDocenteDto) {

    await this.findOne(id);

    let { name_teacher, lastname_teacher, nro_identidad, speciality_teacher, ...rest } = updateDocenteDto;
    name_teacher = name_teacher.toLowerCase().trim();
    lastname_teacher = lastname_teacher.toLowerCase().trim();
    nro_identidad = nro_identidad.toLowerCase().trim();
    speciality_teacher = speciality_teacher.map((val) =>
      val.toLocaleLowerCase().trim(),
    );

    const docenteUpdate = await this.docenteModel.findByIdAndUpdate(
      id,
      { name_teacher, lastname_teacher, nro_identidad, speciality_teacher, ...rest},
      {
        new: true,
      },
    );

    return docenteUpdate;
  }

  async remove(id: string) {

    const docente = await this.findOne(id); 
    docente.isActive = false;

     // TODO: hacer si eliminar o desactivar docente
    const docenteUpdate = await this.docenteModel.findByIdAndUpdate(id, docente, {
      new: true,
    });

    return docenteUpdate;
  }
}
