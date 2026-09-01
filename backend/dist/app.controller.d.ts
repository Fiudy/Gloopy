import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    health(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
