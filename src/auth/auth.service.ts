import {
  BadRequestException,
  Injectable,
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
import { ValidRoles } from './interfaces/role.interface';
import { rolesPermited } from './utils/roles-permited';

@Injectable()
export class AuthService {


  private readonly rolesPermited: string[] = ['ADMIN', 'DOCENTE', 'ESTUDIANTE', 'PARENTS'];

  constructor(
    @InjectModel(Auth.name) private readonly userModel: Model<Auth>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { password, email, nro_identity, username } = loginDto;

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
      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    return { user, token: this.getJWT({ id: user._id }) };
  }

  async create(createAuthDto: CreateAuthDto) {
    let { name, email, password, username, nro_identity, ...restProperties } = createAuthDto;
    name = name.toLowerCase().trim();
    email = email?.toLowerCase().trim();
    username = username?.toLowerCase().trim();
    nro_identity = nro_identity?.toLowerCase().trim();

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

    rolesPermited(restProperties.roles, this.rolesPermited);

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
    const users = await this.userModel
      .find({})
      .skip(Number(desde))
      .limit(5)
      .sort({ created: 1 });
    const countsUser = await this.userModel.countDocuments({});
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

    await this.findOne(id);
    rolesPermited(updateAuthDto.roles, this.rolesPermited);

    const userUpdate = await this.userModel.findByIdAndUpdate(id, updateAuthDto, {
      new: true,
    });

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
    user.isActive = false
    const userUpdate = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return userUpdate;
  }

  private getJWT(payload: JwtInterface): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
