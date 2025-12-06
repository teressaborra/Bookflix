import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        const adminEmail = 'admin@bookflix.com';
        const adminExists = await this.findOneByEmail(adminEmail);

        if (!adminExists) {
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash('admin123', salt);

            await this.create({
                name: 'Admin User',
                email: adminEmail,
                passwordHash,
                role: UserRole.ADMIN
            });
            console.log('Admin user seeded successfully');
        }
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(userData: Partial<User>): Promise<User> {
        console.log('🔵 UsersService.create called with:', {
            name: userData.name,
            email: userData.email,
            role: userData.role
        });

        const user = this.usersRepository.create(userData);
        console.log('🔵 User entity created (not yet saved):', {
            name: user.name,
            email: user.email
        });

        const savedUser = await this.usersRepository.save(user);
        console.log('✅ User saved to database:', {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role
        });

        return savedUser;
    }
}
