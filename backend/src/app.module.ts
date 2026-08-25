import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ServicesModule } from './modules/services/services.module';
import { BlogModule } from './modules/blog/blog.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { MediaModule } from './modules/media/media.module';
import { ContentModule } from './modules/content/content.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PackagesModule } from './modules/packages/packages.module';
import { HealthCardModule } from './modules/health-card/health-card.module';
import { PartnersModule } from './modules/partners/partners.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PatientsModule } from './modules/patients/patients.module';
import { LabTestsModule } from './modules/lab-tests/lab-tests.module';
import { VaccinationsModule } from './modules/vaccinations/vaccinations.module';
import { LabOrdersModule } from './modules/lab-orders/lab-orders.module';
import { HomeCollectionModule } from './modules/home-collection/home-collection.module';
import { LabReportsModule } from './modules/lab-reports/lab-reports.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { RedisCacheModule } from './common/cache/redis-cache.module';

@Module({
  controllers: [AppController],
  providers: [
    // Activate rate-limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Check if DATABASE_URL is provided (Railway/production)
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Parse DATABASE_URL for Railway/Render/Supabase
          const isDev = configService.get('NODE_ENV') === 'development';
          // pg-connection-string treats `sslmode=require` in the URL as a
          // certificate-verifying mode, which conflicts with the explicit
          // `rejectUnauthorized: false` setting below on Supabase pooler URLs.
          // Keep SSL enabled, but let the application-level SSL options win.
          const databaseUrlForTypeorm = (() => {
            try {
              const parsed = new URL(databaseUrl);
              parsed.searchParams.delete('sslmode');
              return parsed.toString();
            } catch {
              return databaseUrl;
            }
          })();
          return {
            type: 'postgres',
            url: databaseUrlForTypeorm,
            // schema MUST be passed even when using DATABASE_URL, otherwise TypeORM
            // silently falls back to `public` and queries the wrong tables.
            schema: configService.get('DATABASE_SCHEMA', 'nita'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            // Honor explicit flag; otherwise default: dev on, prod off.
            synchronize:
              configService.get('DATABASE_SYNCHRONIZE') !== undefined
                ? configService.get('DATABASE_SYNCHRONIZE') === 'true' || configService.get('DATABASE_SYNCHRONIZE') === true
                : isDev,
            logging: isDev,
            ssl: {
              rejectUnauthorized: false,
            },
            extra: {
              max: Number(configService.get('DATABASE_POOL_MAX', 20)),
              idleTimeoutMillis: 30_000,
              connectionTimeoutMillis: 10_000,
              // Force IPv4 resolution. Render's outbound network cannot reach
              // IPv6 destinations, but Supabase's `db.<ref>.supabase.co`
              // hostname advertises both A and AAAA records. Without this,
              // node-postgres picks the IPv6 address first and gets
              // ENETUNREACH on Render.
              family: 4,
            },
          };
        }
        
        // Use individual env variables for local development
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST', 'localhost'),
          port: configService.get('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USER', 'nita_user'),
          password: configService.get('DATABASE_PASSWORD', 'nita_password'),
          database: configService.get('DATABASE_NAME', 'nita_clinics_db'),
          schema: configService.get('DATABASE_SCHEMA', 'nita'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([{
        ttl: configService.get('THROTTLE_TTL', 60) * 1000,
        limit: configService.get('THROTTLE_LIMIT', 100),
      }]),
      inject: [ConfigService],
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Queue (Bull) — use REDIS_URL on Railway; fallback to host/port locally.
    // lazyConnect + bounded retryStrategy so the app boots even when Redis is
    // unreachable (e.g. Render free tier without Redis). Producers in
    // enquiries.service.ts use @Optional() so missing Redis is non-fatal.
    // NOTE: keep enableOfflineQueue: true (default) so Bull's worker setup
    // command is queued while ioredis attempts to connect, instead of throwing
    // 'Stream isn't writeable' on first call.
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL')?.trim();
        const clientOpts = {
          lazyConnect: true,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          retryStrategy: (times: number) =>
            times > 10 ? null : Math.min(times * 200, 2000),
        };
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Redis = require('ioredis');
        const createClient = () => {
          if (url) return new Redis(url, clientOpts);
          return new Redis({
            host: configService.get('REDIS_HOST', 'localhost'),
            port: Number(configService.get('REDIS_PORT', 6379)),
            ...clientOpts,
          });
        };
        return { createClient } as any;
      },
    }),

    RedisCacheModule,

    // Feature modules
    AuthModule,
    UsersModule,
    DoctorsModule,
    AppointmentsModule,
    DepartmentsModule,
    ServicesModule,
    BlogModule,
    EnquiriesModule,
    MediaModule,
    ContentModule,
    TestimonialsModule,
    ClinicsModule,
    ChatbotModule,
    NotificationsModule,
    SettingsModule,
    PackagesModule,
    HealthCardModule,
    PartnersModule,
    PaymentsModule,
    PatientsModule,
    LabTestsModule,
    VaccinationsModule,
    LabOrdersModule,
    HomeCollectionModule,
    LabReportsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
