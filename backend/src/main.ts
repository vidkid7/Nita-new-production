import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  app.use(compression());

  // Security
  app.use(helmet());

  // CORS — browser sends Origin; it must match exactly (including localhost vs 127.0.0.1).
  const primaryFrontend = configService.get('FRONTEND_URL', 'http://localhost:3000');
  const isDev = configService.get('NODE_ENV') !== 'production';
  const devOrigins = Array.from(
    new Set([
      primaryFrontend,
      'http://localhost:3000',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3002',
    ].filter(Boolean)),
  );
  app.enableCors({
    origin: isDev ? devOrigins : primaryFrontend,
    credentials: true,
  });

  // Global prefix (exclude root so GET / returns API info)
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix, { exclude: ['/', '/health'] });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Nita Clinics API')
      .setDescription('REST API for Nita Clinics services and administration')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('doctors', 'Doctor management')
      .addTag('appointments', 'Appointment booking')
      .addTag('departments', 'Department management')
      .addTag('services', 'Services management')
      .addTag('blog', 'Blog posts')
      .addTag('enquiries', 'Contact enquiries')
      .addTag('media', 'Media uploads')
      .addTag('content', 'CMS content')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const rawPort = configService.get('PORT', 3001);
  const port = typeof rawPort === 'string' ? parseInt(rawPort, 10) || 3001 : rawPort;
  // Bind all interfaces (required for Railway / Docker — not only localhost).
  await app.listen(port, '0.0.0.0');

  console.log(`
  Nita Clinics API Server
  ============================
  Environment: ${configService.get('NODE_ENV', 'development')}
  Port: ${port}
  API: http://localhost:${port}/${apiPrefix}
  Docs: http://localhost:${port}/docs
  `);
}

bootstrap();
