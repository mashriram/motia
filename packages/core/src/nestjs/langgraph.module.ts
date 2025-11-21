import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { EventDiscovery } from './event.discovery'
import { EventEmitterService } from './event-emitter.service'
import { LangGraphService } from './langgraph.service'

@Module({
  imports: [DiscoveryModule],
  providers: [LangGraphService, EventDiscovery, EventEmitterService],
  exports: [LangGraphService, EventEmitterService],
})
export class LangGraphModule {}
