import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from '../entities/auth.entity';
import { JwtInterface } from '../interfaces/jwt.interface';

@Injectable()
export class StrategyService extends PassportStrategy(Strategy) {
    
    constructor(private readonly configService: ConfigService, @InjectModel(Auth.name) private readonly userModel: Model<Auth>){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtInterface): Promise<any> { 
        const { id } = payload;        
        // const userDb = await this.userModel.findById('dsdss2334223')
        const userDb = await this.userModel.findById(id)
        // console.log({ id , userDb});
        if (!userDb) {
            throw new UnauthorizedException('Token no valid');
        }

        if (!userDb.isActive) {
            throw new UnauthorizedException('User is inactive. talk with an admin');
        }
        
        return userDb
    }
}
