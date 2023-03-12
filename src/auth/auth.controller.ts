import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from "../auth/decorators/auth.decorator";
import { LoginDto } from './dto/login.dto';
import { ValidRoles } from './interfaces/role.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  // @Auth(ValidRoles.parents, ValidRoles.student, ValidRoles.admin)
  findAll( @Query('desde') desde: string) {
    return this.authService.findAll(desde);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
