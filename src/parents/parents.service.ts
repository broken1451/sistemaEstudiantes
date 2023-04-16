import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Parent } from './entities/parent.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Student } from 'src/student/entities/student.entity';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParentsService {

  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    private readonly configService: ConfigService,
  ) {}


  async create(createParentDto: CreateParentDto) {

    let { name,lastName, ...rest } = createParentDto;
    name = name?.toLowerCase()?.trim();
    lastName = lastName?.toLowerCase()?.trim();
    
    const parent = await this.parentModel.create({ name, lastName, ...rest });

    return parent;
  }

  async findAll(desde: string = '0') {
    const parents = await this.parentModel
      .find({})
      .skip(Number(desde))
      .limit(5)
      .populate('student', '')
      .sort({ created: 1 });
    const countsParents = await this.parentModel.countDocuments({});
    return { parents, countsParents };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    const parent = await this.parentModel
    .findById(id)
    .populate('student', '')

  if (!parent) {
    throw new BadRequestException(`La nota con ${id} no existe`);
  }

  return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }

    let { name,lastName, ...rest } = updateParentDto;
    name = name?.toLowerCase()?.trim();
    lastName = lastName?.toLowerCase()?.trim();

    const parentUpdated = await this.parentModel.findByIdAndUpdate(id, { name,lastName, ...rest }, {new: true}).populate('student', '')
    if (!parentUpdated) {
      throw new BadRequestException(`La nota con el id ${id} no existe`);
    }
    
    return parentUpdated;
  }

  async remove(id: string) {
    const parent: any = await this.findOne(id);
    const parentDeleted = await this.parentModel.findByIdAndDelete(id, parent)
    return parentDeleted;
  }
}
