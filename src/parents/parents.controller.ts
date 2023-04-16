import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  findAll(@Query('desde') desde: string) {
    return this.parentsService.findAll(desde);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(id, updateParentDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.parentsService.remove(id);
  }
}
