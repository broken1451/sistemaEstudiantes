import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtInterface } from './interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { rolesPermited } from './utils/roles-permited';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
  private readonly rolesPermited: string[] = [
    'ADMIN',
    'DOCENTE',
    'ESTUDIANTE',
    'PARENTS',
  ];

  constructor(
    @InjectModel(Auth.name) private readonly userModel: Model<Auth>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { password, email, nro_identity, username } = loginDto;
    const logger = new Logger('Login user');

    let user: Auth;

    if (email) {
      user = await this.userModel.findOne({ email });
    }

    if (username) {
      user = await this.userModel.findOne({ username });
    }

    if (nro_identity) {
      user = await this.userModel.findOne({ nro_identity });
    }

    if (!user) {
      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      if (user.retry == 3) {
        throw new UnauthorizedException(`Usuario Bloqueado`);
      }

      user.retry = user.retry + 1;

      await this.userModel.findByIdAndUpdate(user._id, user, {
        new: true,
      });

      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    if (user.retry == 3) {
      throw new UnauthorizedException(`Usuario Bloqueado`);
    }

    user.retry = 0;
    await this.userModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
    logger.log(`Login user`);
    return {
      ok: true,
      user,
      token: this.getJWT({ id: user._id }),
      menu: this.obtenerMenu(user.roles),
    };
  }

  async create(createAuthDto: CreateAuthDto) {
    let { name, email, password, username, nro_identity, ...restProperties } = createAuthDto;
    name = name.toLowerCase().trim();
    email = email?.toLowerCase().trim();
    username = username?.toLowerCase().trim();
    nro_identity = nro_identity?.toUpperCase().trim();

    let userExist: Auth;

    if (email) {
      userExist = await this.userModel.findOne({ email });
      if (userExist) {
        throw new BadRequestException(
          `El Usuario Existe en la db  con el correo ${userExist.email}`,
        );
      }
    }

    if (username) {
      userExist = await this.userModel.findOne({ username });
      if (userExist) {
        throw new BadRequestException(
          `El Usuario Existe en la db  con el username ${userExist.username}`,
        );
      }
    }

    if (nro_identity) {
      userExist = await this.userModel.findOne({ nro_identity });
      if (userExist) {
        throw new BadRequestException(
          `El Usuario Existe en la db  con el nro_identity ${userExist.nro_identity}`,
        );
      }
    }

    const saltOrRounds = 10;
    password = bcrypt.hashSync(password, saltOrRounds);

    if (!restProperties?.roles) {
      restProperties.roles = ['ESTUDIANTE'];
    }

    if (restProperties?.roles.length == 0) {
      restProperties.roles = ['ESTUDIANTE'];
    }

    //  (!restProperties?.roles) ? restProperties?.roles?.push('ADMIN'): ['']

    let rolesPermit = rolesPermited(restProperties?.roles, this.rolesPermited);
    restProperties.roles = rolesPermit;

    const userCreated = await this.userModel.create({
      name,
      email,
      password,
      username,
      nro_identity,
      ...restProperties,
    });

    return userCreated;
  }

  async findAll(desde: string = '0') {
    const logger = new Logger('findAll user');
    const users = await this.userModel
      .find({})
      .skip(Number(desde))
      .limit(0)
      .sort({ created: 1 });
    const countsUser = await this.userModel.countDocuments({});
    logger.log(`findAll user`);
    return { users, countsUser };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    const userDb = await this.userModel.findById(id);

    if (!userDb) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    return userDb;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const userFound = await this.findOne(id);

    if (updateAuthDto.roles) {
      let rolesPermit = rolesPermited(updateAuthDto.roles, this.rolesPermited);
      updateAuthDto.roles = rolesPermit;

      rolesPermit.forEach((rol) => {
        updateAuthDto.roles.push(rol);
      });

      let rolesPermitNotRepeted = rolesPermited(
        updateAuthDto.roles,
        this.rolesPermited,
      );
      updateAuthDto.roles = rolesPermitNotRepeted;

      if (updateAuthDto.roles.length == 0) {
        updateAuthDto.roles = [];
      }
    }

    // TODO update password User
    // const saltOrRounds = 10;
    // updateAuthDto.password = bcrypt.hashSync(updateAuthDto.password, saltOrRounds);

    updateAuthDto.updated = Date.now();
    const userUpdate = await this.userModel.findByIdAndUpdate(
      id,
      updateAuthDto,
      {
        new: true,
      },
    );

    if (!userUpdate) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    return userUpdate;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    user.isActive = false;
    const userUpdate = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return userUpdate;
  }

  private getJWT(payload: JwtInterface): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findUserByTerm(term: string, desde: string = '0') {
    let expRegular = new RegExp(term, 'i');
    const users = await this.userModel
      .find(
        {
          $or: [
            { name: expRegular },
            { email: expRegular },
            { username: expRegular },
          ],
        },
        '-password',
      )
      .skip(Number(desde))
      .limit(5)
      .sort({ created: 1 });
    const countsUsers = await this.userModel.countDocuments({
      name: expRegular,
      email: expRegular,
      username: expRegular,
    });
    console.log('here', expRegular);
    console.log(countsUsers);
    return { users, countsUsers: users.length };
  }

  obtenerMenu(roles: string[]) {
    let menu = [];
    switch (true) {
      case roles.includes('ADMIN'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'User', url: '/users' },
              { titulo: 'Docentes', url: '/docentes' },
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Padres', url: '/parents' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('DOCENTE') && roles.includes('ESTUDIANTE'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Docentes', url: '/docentes' },
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('DOCENTE') && roles.includes('PARENTS'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Docentes', url: '/docentes' },
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Padres', url: '/parents' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('ESTUDIANTE') && roles.includes('PARENTS'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Padres', url: '/parents' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('PARENTS') && roles.includes('DOCENTE'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Docentes', url: '/docentes' },
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Padres', url: '/parents' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('DOCENTE'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Docentes', url: '/docentes' },
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('ESTUDIANTE'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Materias', url: '/materias' },
              { titulo: 'Perfil', url: '/perfil' },
            ],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;

      case roles.includes('PARENTS'):
        menu = [
          {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [{ titulo: 'Perfil', url: '/perfil' }],
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder',
            submenu: [
              { titulo: 'Notas', url: '/notas' },
              { titulo: 'Padres', url: '/parents' },
              { titulo: 'Estudiantes', url: '/estudiantes' },
            ],
          },
        ];
        return menu;
    }
  }

  async updateImgUser(id: string, nombreArchivo: string) {
    const user = await this.userModel.findById(id).exec();

    if (user.img == '') {
      user.img = nombreArchivo;
      await user.save();
      user.password = ':)';
    } else {
      user.img = nombreArchivo;
      await user.save();
      user.password = ':)';
    }
    return { ok: true, user };
  }

  getAvatarUserImage(imageName: string) {
    const logger = new Logger('getAvatarUserImage');
    // const path = join(__dirname,'ruta donde esta la imagen', nombre archivo a buscar)
    let path = join(__dirname, '../../static/users/', imageName); // crear path fisico donde se encuentra la imagen en el servidor
    if (existsSync(path)) {
      logger.log(`getAvatarUserImage`);
      return path;
    }
    path = join(__dirname, '../../static/noImage/no-img.jpeg');
    logger.log(`getAvatarUserImage`);
    return path;
  }
}
