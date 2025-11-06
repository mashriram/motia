from langgraph.graph import Graph
from event_decorator import on_event
from event_emitter import EventEmitter
from motia_rpc import RpcSender

rpc_sender = RpcSender()
event_emitter = EventEmitter(rpc_sender)

@on_event(rpc_sender, "start_graph")
async def start_graph(data: dict):
    # In a real-world scenario, you would have a more complex graph
    # with multiple nodes and edges.
    workflow = Graph()
    workflow.add_node("start", lambda x: print("Graph started!"))
    workflow.add_node("end", lambda x: print("Graph finished!"))
    workflow.add_edge("start", "end")
    workflow.set_entry_point("start")
    app = workflow.compile()
    await app.invoke({})
    await event_emitter.emit("graph_finished", {"status": "success"})
