import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll(@Query('desde') desde: string) {
    return this.materiaService.findAll(desde);
  }

  @Get('/byTeacher/:idDocente')
  findMateriasByTeacher(@Query('desde') desde: string, @Query('name_materia') name_materia: string, @Param('idDocente') idDocente: string) {
    return this.materiaService.findMateriasByTeacher(desde, idDocente, name_materia);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiaService.update(id, updateMateriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materiaService.remove(id);
  }
}
