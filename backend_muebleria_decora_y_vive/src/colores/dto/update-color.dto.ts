import { PartialType } from '@nestjs/mapped-types';
import { CreateColorDto } from './create-color.dto';

// Permite actualizar los datos del color
export class UpdateColorDto extends PartialType(CreateColorDto) {}