import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('users') // Etiqueta para agrupar las rutas en Swagger
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios', description: 'Obtiene la lista de todos los usuarios.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida con éxito.' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID', description: 'Obtiene un usuario por su ID.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido con éxito.' })
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario', description: 'Crea un nuevo usuario.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito.' })
  async create(@Body() user: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      if (error.code === '23505') {
        // El campo 'username' ya existe, manejar el error de manera adecuada
        throw new ConflictException('El nombre de usuario ya existe');
      }
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID', description: 'Actualiza un usuario por su ID.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con éxito.' })
  update(@Param('id') id: number, @Body() user: CreateUserDto): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID', description: 'Elimina un usuario por su ID.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado con éxito.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('login')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario autenticado con éxito.' })
  @ApiUnauthorizedResponse({ description: 'Credenciales de autenticación no válidas.' })
  async login(@Body() credentials: CreateUserDto): Promise<User | UnauthorizedException> {
    const { username, password } = credentials;
    const authenticatedUser = await this.userService.login(username, password);

    if (!authenticatedUser) {
      throw new UnauthorizedException('Credenciales de autenticación no válidas');
    }

    return authenticatedUser;
  }
}

