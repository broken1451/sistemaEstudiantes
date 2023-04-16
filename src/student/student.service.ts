import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    private readonly configService: ConfigService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    let {
      nro_identidad,
      name_student,
      lastname_student,
      sexo,
      jornada,
      direccion,
      ...rest
    } = createStudentDto;

    name_student = name_student.toLowerCase().trim();
    lastname_student = lastname_student.toLowerCase().trim();
    nro_identidad = nro_identidad.toLowerCase().trim();
    sexo = sexo.toUpperCase().trim();
    jornada = jornada.toLowerCase().trim();
    direccion = direccion.toLowerCase();

    const studentExist =  await this.studentModel.findOne({nro_identidad})
  
    if (studentExist) {
      throw new BadRequestException(`El estudiante con el nro_identidad ${studentExist.nro_identidad} ya existe`);
    }

    const student = await this.studentModel.create({
      nro_identidad,
      name_student,
      lastname_student,
      sexo,
      jornada,
      direccion,
      ...rest,
    });

    return student;
  }

  async findAll(desde: string = '0') {
    const students = await this.studentModel
      .find({})
      .skip(Number(desde))
      .limit(5)
      .sort({ created: 1 });
    const countsStudents = await this.studentModel.countDocuments({});
    return { students, countsStudents };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    const studentDb = await this.studentModel.findById(id);

    if (!studentDb) {
      throw new BadRequestException(`El Estudiante con el id ${id} no existe`);
    }
    return studentDb;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);

    let {
      nro_identidad,
      name_student,
      lastname_student,
      sexo,
      jornada,
      direccion,
      ...rest
    } = updateStudentDto;

    name_student = name_student.toLowerCase().trim();
    lastname_student = lastname_student.toLowerCase().trim();
    nro_identidad = nro_identidad?.toLowerCase()?.trim();
    sexo = sexo.toUpperCase().trim();
    jornada = jornada.toLowerCase().trim();
    direccion = direccion.toLowerCase();

    const studentExist =  await this.studentModel.findOne({nro_identidad})
  
    if (studentExist) {
      throw new BadRequestException(`El estudiante con el nro_identidad ${studentExist.nro_identidad} ya existe`);
    }


    const studentUpdate = await this.studentModel.findByIdAndUpdate(
      id,
      {
        nro_identidad,
        name_student,
        lastname_student,
        sexo,
        jornada,
        direccion,
        ...rest,
      },
      {
        new: true,
      },
    );

    if (!studentUpdate) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }

    return studentUpdate;
  }

  async remove(id: string) {

    const student = await this.findOne(id); 
    console.log(student);
    student.isActive = false;

    // TODO: hacer si eliminar o desactivar docente
    const studentUpdate = await this.studentModel.findByIdAndUpdate(
      id,
      student,
      {
        new: true,
      },
    );

    return studentUpdate;
  }
}
