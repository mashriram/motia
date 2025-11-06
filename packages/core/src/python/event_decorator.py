from functools import wraps
from motia_rpc import RpcSender

def on_event(rpc: RpcSender, topic: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await func(*args, **kwargs)

        rpc.send_no_wait("subscribe", {"topic": topic})

        return wrapper
    return decorator
