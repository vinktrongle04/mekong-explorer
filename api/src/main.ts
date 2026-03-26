import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[DEBUG] API is bootstrapping...');
  const app = await NestFactory.create(AppModule);
  console.log('[DEBUG] NestFactory.create successful.');
  
  // Enable CORS
  app.enableCors();
  
  const port = process.env.PORT ?? 3000;
  console.log(`[DEBUG] Attempting to listen on 0.0.0.0:${port}...`);
  
  await app.listen(port, '0.0.0.0');
  console.log(`[DEBUG] API is now running and listening at 0.0.0.0:${port}`);
}

bootstrap().catch(err => {
  console.error('[CRITICAL] API failed to bootstrap:', err);
  process.exit(1);
});
