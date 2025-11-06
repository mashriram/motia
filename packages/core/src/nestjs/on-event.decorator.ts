import { SetMetadata } from '@nestjs/common'

export const ON_EVENT_METADATA = '__on_event_metadata__'

export const OnEvent = (topic: string) => SetMetadata(ON_EVENT_METADATA, topic)
