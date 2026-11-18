
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'clave-temporal-solo-desarrollo',
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.rol) {
      throw new UnauthorizedException('Token no valido');
    }

    return {
      id_usuario: payload.sub,
      usuario: payload.usuario,
      rol: payload.rol,
    };
  }
}
