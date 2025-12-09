import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { TheatersService } from './theaters/theaters.service';
import { UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seedTheaterOwners() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const theatersService = app.get(TheatersService);

    try {
        // Get all theaters
        const theaters = await theatersService.findAll();
        
        console.log(`Found ${theaters.length} theaters. Creating owner accounts...`);

        for (let i = 0; i < theaters.length; i++) {
            const theater = theaters[i];
            const email = `theater${i + 1}@gmail.com`;
            const password = `theater${i + 1}pass`;
            
            // Check if user already exists
            const existingUser = await usersService.findOneByEmail(email);
            
            if (existingUser) {
                console.log(`✓ Theater owner for ${theater.name} already exists: ${email}`);
                continue;
            }

            // Create theater owner account
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            await usersService.create({
                name: `${theater.name} Owner`,
                email: email,
                passwordHash: passwordHash,
                role: UserRole.THEATER_OWNER,
                theaterId: theater.id,
            });

            console.log(`✓ Created theater owner for ${theater.name}`);
            console.log(`  Email: ${email}`);
            console.log(`  Password: ${password}`);
        }

        console.log('\n✅ Theater owner accounts created successfully!');
    } catch (error) {
        console.error('❌ Error seeding theater owners:', error);
    } finally {
        await app.close();
    }
}

seedTheaterOwners();
