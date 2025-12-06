import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        console.log('🔵 Registration attempt for email:', registerDto.email);

        const existingUser = await this.usersService.findOneByEmail(registerDto.email);
        if (existingUser) {
            console.log('❌ Email already exists:', registerDto.email);
            throw new ConflictException('Email already exists');
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(registerDto.password, salt);

        console.log('🔵 Creating new user with data:', {
            name: registerDto.name,
            email: registerDto.email,
            role: UserRole.USER
        });

        const user = await this.usersService.create({
            ...registerDto,
            passwordHash,
            role: UserRole.USER, // Default role
        });

        console.log('✅ User created successfully:', {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        return this.login(user);
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log('🔵 Login attempt for email:', email);

        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            console.log('❌ User not found:', email);
            return null;
        }

        const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
        if (isPasswordValid) {
            console.log('✅ Login successful for:', email);
            const { passwordHash, ...result } = user;
            return result;
        }

        console.log('❌ Invalid password for:', email);
        return null;
    }
}
