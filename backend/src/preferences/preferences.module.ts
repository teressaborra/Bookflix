import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './entities/user-preference.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserPreference])],
    exports: [TypeOrmModule],
})
export class PreferencesModule {}