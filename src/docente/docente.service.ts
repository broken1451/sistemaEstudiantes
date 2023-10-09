import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Docente } from './entities/docente.entity';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class DocenteService {

  constructor(
    @InjectModel(Docente.name) private readonly docenteModel: Model<Docente>,
    private readonly configService: ConfigService,
    @InjectModel(Auth.name) private readonly userModel: Model<Auth>
  ) {}

  async create(createDocenteDto: CreateDocenteDto) {
    let { name_teacher, lastname_teacher, nro_identidad, speciality_teacher, ...rest } = createDocenteDto;
    name_teacher = name_teacher.toLowerCase().trim();
    lastname_teacher = lastname_teacher.toLowerCase().trim();
    nro_identidad = nro_identidad.toUpperCase().trim();
    console.log(speciality_teacher);

    if (!speciality_teacher) {
      speciality_teacher = [];
    }


    speciality_teacher = speciality_teacher.map((val) =>
      val.toLocaleLowerCase().trim(),
    );

    let specialites: string[] = [];
    specialites = speciality_teacher?.filter((item, index) => {
      return speciality_teacher?.indexOf(item) === index;
    });
    
    if (speciality_teacher.length == 0) {
      speciality_teacher= [];
    }

    speciality_teacher = specialites;

    const exist = await this.userModel.findOne({nro_identity: nro_identidad});
   
    if (exist) {
      throw new BadRequestException(`El registro con nro_identidad  ${exist.nro_identity} ya existe`);
    }

    const docenteExist =  await this.docenteModel.findOne({nro_identidad})
  
    if (docenteExist) {
      throw new BadRequestException(`El docente con el nro_identidad ${docenteExist.nro_identidad} ya existe`);
    }

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
    nro_identidad = nro_identidad?.toLowerCase()?.trim();
    speciality_teacher = speciality_teacher.map((val) =>
      val.toLocaleLowerCase().trim(),
    );

    let specialites: string[] = [];
    specialites = speciality_teacher?.filter((item, index) => {
      return speciality_teacher?.indexOf(item) === index;
    });

    speciality_teacher = specialites;

    const docenteExist =  await this.docenteModel.findOne({nro_identidad})
  
    if (docenteExist) {
      throw new BadRequestException(`El docente con el nro_identidad ${docenteExist.nro_identidad} ya existe`);
    }

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
