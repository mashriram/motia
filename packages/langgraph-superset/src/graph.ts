import { END, START, StateGraph } from '@langchain/langgraph'
import { v4 as uuidv4 } from 'uuid'
import type { BasicSubscriber } from './subscriber'
import type { ToolCaller } from './tool-caller'
import type { Event, Graph, Subscriber } from './types'

export class AsyncGraph implements Graph {
  private graph: StateGraph<any>

  constructor(
    private readonly subscriber: Subscriber,
    private readonly toolCaller?: ToolCaller,
  ) {
    this.graph = new StateGraph({
      channels: {
        value: {
          value: (x: any, y: any) => y,
          default: () => 'start',
        },
      },
    })

    this.graph.addNode('start', this.handleStart.bind(this))
    this.graph.addNode('tool_result', this.handleToolResult.bind(this))
    this.graph.addEdge(START, 'start')
    this.graph.addConditionalEdges('start', (x: any) => (x.result ? 'tool_result' : END), {
      tool_result: 'tool_result',
      [END]: END,
    })
    this.graph.addEdge('tool_result', END)
    this.graph.setEntryPoint(START)
  }

  async processEvent(event: Event): Promise<Event> {
    const taskId = uuidv4()
    // Give a pre-built answer.
    return {
      topic: 'interim_response',
      data: {
        message: 'I am working on your request. I will get back to you shortly.',
        taskId,
      },
      context: event.context,
    }
  }

  startTask(event: Event): Promise<void> {
    // Start the long-running task in the background.
    const app = this.graph.compile()
    app.invoke(event.data).then((result) => {
      ;(this.subscriber as BasicSubscriber).notify({
        topic: 'task_finished',
        data: result,
        context: { ...event.context, taskId: (event.data as any).taskId },
      })
    })
    return Promise.resolve()
  }

  private async handleStart(data: any): Promise<any> {
    if (this.toolCaller) {
      const tools = await this.toolCaller.getTools()
      if (tools.length > 0) {
        const result = await tools[0].invoke(data)
        return { value: 'tool_result', result }
      }
    }
    return { value: '__end__' }
  }

  private async handleToolResult(data: any): Promise<any> {
    console.log('Tool result:', data.result)
    return { value: '__end__' }
  }
}
