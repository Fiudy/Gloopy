"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const domain_exception_filter_1 = require("./common/filters/domain-exception.filter");
async function bootstrap() {
    if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-me-in-production')) {
        throw new Error('JWT_SECRET seguro é obrigatório em produção.');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: { origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN ?? false : true } });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new domain_exception_filter_1.DomainExceptionFilter());
    const port = process.env.PORT ? Number(process.env.PORT) : 3333;
    await app.listen(port, '0.0.0.0');
    console.log(`Gloopy API rodando na porta ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map