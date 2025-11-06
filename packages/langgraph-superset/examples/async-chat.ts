import { AsyncGraph } from '../src/graph'
import { McpAdapter } from '../src/mcp-adapter'
import { BasicSubscriber } from '../src/subscriber'
import type { Event } from '../src/types'

async function main() {
  const subscriber = new BasicSubscriber()
  const mcpAdapter = new McpAdapter({
    // MCP server configuration
  })
  const graph = new AsyncGraph(subscriber, mcpAdapter)

  const event: Event = {
    topic: 'user_message',
    data: {
      message: 'Hello, world!',
    },
    context: {},
  }

  const interimResponse = await graph.processEvent(event)
  console.log('Interim Response:', interimResponse)
  const taskId = (interimResponse.data as any).taskId

  subscriber.subscribe('task_finished', (e) => {
    if (e.context.taskId === taskId) {
      console.log('Task Finished:', e)
    }
  })

  graph.startTask({ ...event, data: { ...event.data, taskId } })
}

main()
