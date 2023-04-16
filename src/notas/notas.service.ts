import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Nota } from './entities/nota.entity';
import { Student } from 'src/student/entities/student.entity';
import { Materia } from 'src/materia/entities/materia.entity';


@Injectable()
export class NotasService {
  // public notesMat: Nota[] | Materia[] = [];

  constructor(
    @InjectModel(Nota.name) private readonly noteModel: Model<Nota>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Materia.name) private readonly materiaModel: Model<Materia>,
    // @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService,
    // @Inject(forwardRef(() => DocenteService)) private readonly docenteService: DocenteService,
    private readonly configService: ConfigService,
  ) { }

  async create(createNotaDto: CreateNotaDto) {
    let { note, ...rest } = createNotaDto;
    note = note;

    const nota = await this.noteModel.create({
      note,
      ...rest,
    });

    return nota;
  }

  async findAll(desde: string = '0') {
    const notas = await this.noteModel
      .find({})
      .skip(Number(desde))
      .limit(5)
      .populate('student', '-_id')
      .populate({
        path: 'materia',
        populate: {
          path: 'docente',
          // select: '-_id',
        },
      })
      .sort({ created: 1 });
    const countsMaterias = await this.noteModel.countDocuments({});
    return { notas, countsMaterias };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }

    const nota = await this.noteModel
      .findById(id)
      .populate('student', '')
      .populate({
        path: 'materia',
        // select: '-_id',
        populate: {
          path: 'docente',
          // select: '-_id',
        },
      });

    if (!nota) {
      throw new BadRequestException(`La nota con ${id} no existe`);
    }

    return nota;
  }

  async findMateriasByMateriaAndStudent(desde: string = '0', name_materia: string, name_student: string ) {
    if (name_materia && name_student) {
      let resp = await  this.filterByQuery(name_materia,name_student,'student','materia','docente','0');
      return {resp};
    } else if (name_materia) {
      let resp = await  this.filterByQuery(name_materia,name_student,'student','materia','docente','0');
      return {resp};
    } else if (name_student) {
      let resp = await  this.filterByQuery(name_materia,name_student,'student','materia','docente','0');
      return {resp};
    }

    let resp = await  this.filterByQuery(name_materia,name_student,'student','materia','docente','0');
    return {resp};
  }

  async update(id: string, updateNotaDto: UpdateNotaDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }

    const notesUpdated = await this.noteModel.findByIdAndUpdate(id, updateNotaDto, {new: true}).populate('student', '')
    .populate({
      path: 'materia',
      // select: '-_id',
      populate: {
        path: 'docente',
        // select: '-_id',
      },
    });
    if (!notesUpdated) {
      throw new BadRequestException(`La nota con el id ${id} no existe`);
    }
    
    return notesUpdated;
  }

  async remove(id: string) {
    const nota: any = await this.findOne(id);
    const noteDeleted = await this.noteModel.findByIdAndDelete(id, nota).populate('student', '')
    .populate({
      path: 'materia',
      // select: '-_id',
      populate: {
        path: 'docente',
        // select: '-_id',
      },
    });
    return noteDeleted;
  }




  async filterByQuery(
    name_materia?: string,
    name_student?: string,
    student?: string,
    materia?: string,
    docente?: string,
    desde?: string,
  ) {
    if (name_materia && name_student) {
      console.log({
        name_materia,
        name_student,
        student,
        materia,
        docente,
        desde,
      });

      let expRegularNameMateria = new RegExp(name_materia, 'i');
      await this.materiaModel
        ?.find({ nombre_materia: expRegularNameMateria })
        ?.populate(docente, '-_id');
      let materiaByName: Nota[] | Materia[] | any;

      materiaByName = (
        await this.noteModel
          ?.find({})
          ?.populate({
            path: student,
          })
          ?.populate({
            path: materia,
            populate: {
              path: docente,
            },
          })
      )?.filter((arr: any) => {
        return arr
          ? arr.materia.nombre_materia?.includes(name_materia?.trim())
          : [];
      });
      
      let expRegularNameStudent = new RegExp(name_student, 'i');
      await this.studentModel.find({ name_student: expRegularNameStudent });
      let materiaByNameStudent: Nota[] | Materia[] | any;
      materiaByNameStudent = (
        await this.noteModel
          .find({})
          .populate({
            path: student,
            // select: '-_id',
          })
          .populate({
            path: materia,
            populate: {
              path: docente,
            },
          })
      ).filter((arr: any) => {
        return arr
          ? arr.student.name_student.includes(name_student.trim())
          : [];
      });

      return {
        materiaByName,
        materiaByNameStudent,
        countsNotasMateria: materiaByName.length,
        countsNotasStudents: materiaByNameStudent.length,
      };
    } else if (name_student) {
      
      let expRegularNameStudent = new RegExp(name_student, 'i');
      await this.studentModel.find({ name_student: expRegularNameStudent });

      let materiaByNameStudent: Nota[] | Materia[] | any;

      materiaByNameStudent = (
        await this.noteModel.find({}).populate({
          path: student,
        }).populate(
          {
            path: materia,
            populate: {
              path: docente,
              // select: '-_id',
            },
          }
        )
      ).filter((arr: any) => {
        return arr
          ? arr.student.name_student.includes(name_student.trim())
          : [];
      });

      return { materiaByNameStudent, countsNotasStudents: materiaByNameStudent.length };
    } else if (name_materia) {
      
      let expRegularNameMateria = new RegExp(name_materia, 'i');

      await this.materiaModel
      .find({ nombre_materia: expRegularNameMateria })
      .populate(docente, '-_id');


      let materiaByName: Nota[] | Materia[];

      materiaByName = (
        await this.noteModel.find({}).populate({
          path: student,
        }).populate({
          path: materia,
          // select: '-_id',
          populate: {
            path: docente,
          },
        })
      ).filter((arr: any) => {
        return arr
          ? arr.materia.nombre_materia.includes(name_materia.trim())
          : [];
      });


      return { materiaByName, countsNotasMateria: materiaByName.length };

    } else {

      let notes = await this.noteModel
      .find({})
      .populate(student, '')
      .populate({
        path: materia,
        populate: {
          path: docente,
          // select: '-_id',
        },
      });

    return { notes, countsNotasMateria: notes.length };
    }
  }


}
