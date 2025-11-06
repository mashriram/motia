import { Injectable } from '@nestjs/common'
import type { EventManager } from '../event-manager'
import { generateTraceId } from '../generate-trace-id'
import { BaseLoggerFactory } from '../logger-factory'
import { NoTracer } from '../observability/no-tracer'
import type { Event } from '../types'

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventManager: EventManager) {}

  emit(topic: string, data: any): void {
    const loggerFactory = new BaseLoggerFactory(false, {
      set: () => Promise.resolve(),
    } as any)
    const event: Event<any> = {
      topic,
      data,
      traceId: generateTraceId(),
      logger: loggerFactory.create({
        traceId: generateTraceId(),
        stepName: 'event-emitter',
      }),
      tracer: new NoTracer(),
    }
    this.eventManager.emit(event)
  }
}
