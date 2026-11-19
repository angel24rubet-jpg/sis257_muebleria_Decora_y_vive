import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientesService } from "./clientes.service";
import { ClientesController } from "./clientes.controller";
import { Cliente } from "./entities/cliente.entity";
import { Usuario } from "../usuarios/entities/usuario.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Usuario])],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
