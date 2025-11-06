# LangGraph Integration with FastAPI

This document explains how to use the LangGraph integration with FastAPI in the Motia framework.

## Getting Started

To get started, you'll need to create a Python file that defines your LangGraph and a FastAPI application. You can then use the `@on_event` decorator to trigger your LangGraph from a Motia event.

### Example

Here's an example of a simple LangGraph that's triggered by a Motia event:

```python
from fastapi import FastAPI
from langgraph.graph import Graph
from event_decorator import on_event
from event_emitter import EventEmitter
from motia_rpc import RpcSender

app = FastAPI()
rpc_sender = RpcSender()
event_emitter = EventEmitter(rpc_sender)

@on_event(app, "start_graph")
async def start_graph(data: dict):
    # In a real-world scenario, you would have a more complex graph
    # with multiple nodes and edges.
    workflow = Graph()
    workflow.add_node("start", lambda x: print("Graph started!"))
    workflow.add_node("end", lambda x: print("Graph finished!"))
    workflow.add_edge("start", "end")
    app = workflow.compile()
    await app.invoke({})
    await event_emitter.emit("graph_finished", {"status": "success"})
```

## Decorators

### `@on_event(app, topic)`

The `@on_event` decorator allows you to define a function that will be called when a Motia event is received.

*   `app`: The FastAPI application instance.
*   `topic`: The name of the Motia event to listen for.

## EventEmitter

The `EventEmitter` class allows you to emit Motia events from your FastAPI application.

### `emit(topic, data)`

*   `topic`: The name of the event to emit.
*   `data`: A dictionary containing the event data.
