import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, UserShema } from './entities/auth.entity';
import { StrategyService } from './strategy/strategy.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, StrategyService],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => { // se inyecta el servicio como en cualquier constructor o cualquier clases, solo q aca es una funcion 
        return {
          secret: configService.get('JWT_SECRET') || '', 
          signOptions: {
            expiresIn: '4h'
          }
        }
      } // es la funcion que voy a mandar a llamar cuando se intente registrar de manera asincrono el modulo 
    }),
    MongooseModule.forFeature([{ name: Auth.name, schema: UserShema, collection:'auths' }])
  ],
  exports: [MongooseModule, AuthService, ConfigModule, StrategyService, PassportModule, JwtModule]
})
export class AuthModule {}
