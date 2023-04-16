import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notasService.create(createNotaDto);
  }

  @Get()
  findAll(@Query('desde') desde: string) {
    return this.notasService.findAll(desde);
  }

  @Get('/ByMaterialAndStudent')
  findMateriasByMateriaAndStudent(@Query('desde') desde: string, @Query('name_materia') name_materia: string, @Query('name_student') name_student: string) {
    return this.notasService.findMateriasByMateriaAndStudent(desde, name_materia, name_student);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.notasService.findOne(id);
  }



  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateNotaDto: UpdateNotaDto) {
    return this.notasService.update(id, updateNotaDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.notasService.remove(id);
  }
}
