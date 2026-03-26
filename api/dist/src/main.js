"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    console.log('[DEBUG] API is bootstrapping...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('[DEBUG] NestFactory.create successful.');
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
//# sourceMappingURL=main.js.map