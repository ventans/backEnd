import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'exampleUsername', description: 'El nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'examplePassword', description: 'La contraseña' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
