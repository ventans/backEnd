import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}
    
      findAll(): Promise<User[]> {
        return this.userRepository.find();
      }
    
      async findOneById(id: number) {
        return this.userRepository.findOne({
            where: {
                id
            }
        });
      }
    
      async create(user: CreateUserDto): Promise<User> {
        return this.userRepository.save(user);
      }
    
      update(id: number, user: CreateUserDto): Promise<User> {
        return this.userRepository.update(id, user).then(() => this.userRepository.findOne({
            where: {
                id
            }
        }));
      }
    
      remove(id: number): Promise<void> {
        return this.userRepository.delete(id).then(() => undefined);
      }

      async login(username: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { username, password } });

        if (!user) {
            return null; // Usuario no encontrado
        }

        if (user.password !== password) {
            return null; // Contraseña incorrecta
        }

        return user; // Usuario autenticado
    }
}
