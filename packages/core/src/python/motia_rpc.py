from typing import Any, Union
from motia_communication_factory import create_communication
from motia_rpc_communication import RpcCommunication
from motia_ipc_communication import IpcCommunication

def serialize_for_json(obj: Any) -> Any:
    """Convert Python objects to JSON-serializable types"""
    if hasattr(obj, '__dict__'):
        return obj.__dict__
    elif hasattr(obj, '_asdict'):  # For namedtuples
        return obj._asdict()
    elif isinstance(obj, (list, tuple)):
        return [serialize_for_json(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: serialize_for_json(v) for k, v in obj.items()}
    else:
        return obj

class RpcSender:
    """Unified communication interface that delegates to appropriate implementation"""
    
    def __init__(self):
        self._communication: Union[RpcCommunication, IpcCommunication] = create_communication()
        self.callbacks = {}

    def register_callback(self, topic: str, callback: Any) -> None:
        """Register a callback for a topic"""
        self.callbacks[topic] = callback
        
    def send_no_wait(self, method: str, args: Any) -> None:
        """Send request without waiting for response"""
        return self._communication.send_no_wait(method, args)

    async def send(self, method: str, args: Any) -> Any:
        """Send request and wait for response"""
        return await self._communication.send(method, args)

    async def init(self) -> None:
        """Initialize communication"""
        return await self._communication.init()

    async def receive(self) -> Any:
        """Receive message"""
        return await self._communication.receive()

    def close(self) -> None:
        """Close communication"""
        return self._communication.close()
