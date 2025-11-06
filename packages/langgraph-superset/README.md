# LangGraph Superset Framework

This document explains how to use the LangGraph Superset Framework to build asynchronous, non-sequential chat systems.

## Getting Started

To get started, you'll need to create an instance of the `AsyncGraph` and a `Subscriber`. You can then use the `processEvent` method to get an immediate response and the `startTask` method to start a long-running task.

### Example

Here's an example of a simple asynchronous chat:

```typescript
import { AsyncGraph } from './src/graph';
import { BasicSubscriber } from './src/subscriber';
import { McpAdapter } from './src/mcp-adapter';
import { Event } from './src/types';

async function main() {
  const subscriber = new BasicSubscriber();
  const mcpAdapter = new McpAdapter({
    'my-tool-server': {
      transport: 'stdio',
      command: 'node',
      args: ['./examples/mcp-server.js'],
    }
  });
  const graph = new AsyncGraph(subscriber, mcpAdapter);

  const event: Event = {
    topic: 'user_message',
    data: {
      message: 'Hello, world!',
    },
    context: {},
  };

  const interimResponse = await graph.processEvent(event);
  console.log('Interim Response:', interimResponse);
  const taskId = (interimResponse.data as any).taskId;

  subscriber.subscribe('task_finished', (e) => {
    if (e.context.taskId === taskId) {
      console.log('Task Finished:', e);
    }
  });

  graph.startTask({ ...event, data: { ...event.data, taskId } });
}

main();
```

## Tool Calling

The LangGraph Superset Framework includes support for the Model Context Protocol (MCP).

### MCP

To use MCP, you'll need to create an instance of the `McpAdapter`:

```typescript
import { McpAdapter } from './src/mcp-adapter';

const mcpAdapter = new McpAdapter({
  'my-tool-server': {
    transport: 'stdio',
    command: 'node',
    args: ['./examples/mcp-server.js'],
  }
});

const tools = await mcpAdapter.getTools();
```
