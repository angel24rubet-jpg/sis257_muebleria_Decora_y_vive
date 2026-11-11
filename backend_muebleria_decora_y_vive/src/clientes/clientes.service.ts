
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    // Conexion con la tabla clientes
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  // Registrar un cliente
  async create(createClienteDto: CreateClienteDto) {
    const clienteExistente = await this.clienteRepository.findOneBy({
      ci: createClienteDto.ci,
    });

    if (clienteExistente) {
      throw new ConflictException('El CI ya esta registrado');
    }

    const cliente = this.clienteRepository.create(createClienteDto);

    return await this.clienteRepository.save(cliente);
  }

  // Listar todos los clientes
  async findAll() {
    return await this.clienteRepository.find();
  }

  // Buscar un cliente por ID
  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({
      id_cliente: id,
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${id} no encontrado`,
      );
    }

    return cliente;
  }

  // Actualizar un cliente
  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);

    if (updateClienteDto.ci && updateClienteDto.ci !== cliente.ci) {
      const clienteExistente = await this.clienteRepository.findOneBy({
        ci: updateClienteDto.ci,
      });

      if (clienteExistente) {
        throw new ConflictException('El CI ya esta registrado');
      }
    }

    Object.assign(cliente, updateClienteDto);

    return await this.clienteRepository.save(cliente);
  }

  // Eliminar un cliente
  async remove(id: number) {
    const cliente = await this.findOne(id);

    await this.clienteRepository.remove(cliente);

    return {
      mensaje: 'Cliente eliminado correctamente',
    };
  }
}
