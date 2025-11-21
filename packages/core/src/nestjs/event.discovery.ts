import { Injectable, type OnModuleInit } from '@nestjs/common'
import type { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import type { EventManager } from '../event-manager'
import { ON_EVENT_METADATA } from './on-event.decorator'

@Injectable()
export class EventDiscovery implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly eventManager: EventManager,
  ) {}

  onModuleInit() {
    const wrappers = this.discoveryService.getControllers()
    wrappers.forEach((wrapper) => {
      const { instance } = wrapper
      const prototype = Object.getPrototypeOf(instance)
      this.metadataScanner.scanFromPrototype(instance, prototype, (methodName: string) =>
        this.subscribeToEventIfDecorated(instance, methodName),
      )
    })
  }

  private subscribeToEventIfDecorated(instance: any, methodName: string) {
    const method = instance[methodName]
    const topic = this.reflector.get<string>(ON_EVENT_METADATA, method)
    if (topic) {
      this.eventManager.subscribe({
        event: topic,
        handler: method.bind(instance),
        filePath: instance.constructor.name,
        handlerName: methodName,
      })
    }
  }
}
