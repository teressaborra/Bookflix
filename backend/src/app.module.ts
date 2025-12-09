import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { TheatersModule } from './theaters/theaters.module';
import { ShowsModule } from './shows/shows.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { SeatRecommendationsModule } from './seat-recommendations/seat-recommendations.module';
import { DynamicPricingModule } from './dynamic-pricing/dynamic-pricing.module';
import { PreferencesModule } from './preferences/preferences.module';
import { GroupBookingsModule } from './group-bookings/group-bookings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TheaterOwnerModule } from './theater-owner/theater-owner.module';
import { User } from './users/entities/user.entity';
import { Movie } from './movies/entities/movie.entity';
import { Theater } from './theaters/entities/theater.entity';
import { Show } from './shows/entities/show.entity';
import { Booking } from './bookings/entities/booking.entity';
import { ReservedSeat } from './bookings/entities/reserved-seat.entity';
import { MovieReview } from './reviews/entities/movie-review.entity';
import { UserPoints } from './loyalty/entities/user-points.entity';
import { UserPreference } from './preferences/entities/user-preference.entity';
import { GroupBooking } from './group-bookings/entities/group-booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        const baseConfig = {
          type: 'postgres' as const,
          entities: [
            User, 
            Movie, 
            Theater, 
            Show, 
            Booking, 
            ReservedSeat,
            MovieReview,
            UserPoints,
            UserPreference,
            GroupBooking
          ],
          synchronize: true, // Auto-create tables (dev only)
        };

        if (databaseUrl) {
          return {
            ...baseConfig,
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
          };
        }

        return {
          ...baseConfig,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'root'),
          database: configService.get<string>('DB_NAME', 'bookflix'),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MoviesModule,
    TheatersModule,
    ShowsModule,
    BookingsModule,
    ReviewsModule,
    LoyaltyModule,
    RecommendationsModule,
    SeatRecommendationsModule,
    DynamicPricingModule,
    PreferencesModule,
    GroupBookingsModule,
    AnalyticsModule,
    TheaterOwnerModule,
  ],
})
export class AppModule { }
