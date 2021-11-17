import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

/**
 * Interface to control the parameter of the decorator
 * example to not write string in the decorator because the decorator can handle just DTO object
 */
interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {};
}
/**
 *  this function create decorator.
 *  Decorator to control response data.
 *  example exclude password from user.
 */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled
    // by the request handler
    // console.log('Im running before the handler', context);
    return next.handle().pipe(
      map((date: any) => {
        // Run something before the response sent out
        //console.log('Im running before response is sent out', date);
        return plainToClass(this.dto, date, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
