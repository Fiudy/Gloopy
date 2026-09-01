import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { DomainError } from '@shared/domain/domain-error';
export declare class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost): void;
}
