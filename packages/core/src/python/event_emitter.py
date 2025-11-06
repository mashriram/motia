from motia_rpc import RpcSender

class EventEmitter:
    def __init__(self, rpc: RpcSender):
        self.rpc = rpc

    async def emit(self, topic: str, data: dict):
        await self.rpc.send("emit", {"topic": topic, "data": data})
