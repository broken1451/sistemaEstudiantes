import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, Req, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from "../auth/decorators/auth.decorator";
import { LoginDto } from './dto/login.dto';
import { ValidRoles } from './interfaces/role.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { fileNamer } from './helpersFile/fileNamer.helper';
import { fileFilter } from './helpersFile/fileFilter.helper';
import { Response } from 'express';
import { RutPipePostUser } from 'src/pipes/rut-user.pipe.pipe';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post()
  create(@Body(new RutPipePostUser()) createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }


  @Get('/findUserByTerm/:term')
  findUserByTerm(@Param('term') term: string,  @Query('desde') desde: string) {
    return this.authService.findUserByTerm(term, desde);
  }

  @Get()
  // @Auth(ValidRoles.parents, ValidRoles.student, ValidRoles.admin)
  findAll(@Query('desde') desde: string) {
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
  // @Auth(ValidRoles.admin) 
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
  
  @Put('/upload-image-user/:id')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/users', // raiz del proyecto
      filename: fileNamer,
    })
  }))
  uploadoImage(@Req() req: any, @Param('id') id: string) {

    if (!req.file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const nombreArchivo = req.file; //imagen es el nombre que esta en el postman
    const nombreArchivoSeparado = nombreArchivo.originalname.split('.');
    const extensionArchivo = nombreArchivoSeparado[nombreArchivoSeparado.length - 1];
    const nombreImagenPersonalizado = `${id}.${extensionArchivo}`;

    return this.authService.updateImgUser(id, nombreImagenPersonalizado);
  }

  @Get('/userImage/:imageName')
  findProductImage(@Param('imageName') imageName: string, @Res() res: Response) {
    // const upload = multer({ storage: storage }).
    const path = this.authService.getAvatarUserImage(imageName)
    return res.status(200).sendFile(path);
  }


}
