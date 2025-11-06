# LangGraph Integration with NestJS

This document explains how to use the LangGraph integration with NestJS in the Motia framework.

## Getting Started

To get started, you'll need to create a NestJS module that imports the `LangGraphModule`. You can then inject the `LangGraphService` and `EventEmitterService` into your controllers and services.

### Example

Here's an example of a simple LangGraph that's triggered by a Motia event:

```typescript
import { Controller } from '@nestjs/common';
import { OnEvent } from '../../on-event.decorator';
import { LangGraphService } from '../../langgraph.service';
import { EventEmitterService } from '../../event-emitter.service';
import { StateGraph, END } from '@langchain/langgraph';

@Controller()
export class BasicGraphController {
  constructor(
    private readonly langGraphService: LangGraphService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @OnEvent('start_graph')
  async handleStartGraph(data: any): Promise<void> {
    const workflow = new StateGraph({
      channels: {
        value: {
          value: () => 'start',
          default: () => 'start',
        },
      },
    });

    workflow.addNode('start', async () => {
      console.log('Graph started!');
      return { value: 'end' };
    });
    workflow.addNode('end', async () => {
      console.log('Graph finished!');
      return { value: END };
    });

    workflow.addEdge('start', 'end');
    workflow.setEntryPoint('start');

    await this.langGraphService.runGraph(workflow);
    this.eventEmitterService.emit('graph_finished', { status: 'success' });
  }
}
```

## Decorators

### `@OnEvent(topic)`

The `@OnEvent` decorator allows you to define a method that will be called when a Motia event is received.

*   `topic`: The name of the Motia event to listen for.

## Services

### `LangGraphService`

The `LangGraphService` provides a `runGraph` method that allows you to execute a LangGraph.

*   `runGraph(graph)`: Executes a LangGraph.

### `EventEmitterService`

The `EventEmitterService` provides an `emit` method that allows you to emit Motia events from your NestJS application.

*   `emit(topic, data)`: Emits a Motia event.
