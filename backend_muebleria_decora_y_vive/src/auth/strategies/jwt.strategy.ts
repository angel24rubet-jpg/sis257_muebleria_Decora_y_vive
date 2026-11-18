import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("JWT_SECRET") ||
        "clave-temporal-solo-desarrollo",
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.rol) {
      throw new UnauthorizedException("Token no valido");
    }

    return {
      id_usuario: payload.sub,
      usuario: payload.usuario,
      rol: payload.rol,
    };
  }
}
