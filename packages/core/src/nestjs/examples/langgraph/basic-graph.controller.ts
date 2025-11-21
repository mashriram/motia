import { END, StateGraph } from '@langchain/langgraph'
import { Controller } from '@nestjs/common'
import type { EventEmitterService } from '../../event-emitter.service'
import type { LangGraphService } from '../../langgraph.service'
import { OnEvent } from '../../on-event.decorator'

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
    })

    workflow.addNode('start', async () => {
      console.log('Graph started!')
      return { value: 'end' }
    })
    workflow.addNode('end', async () => {
      console.log('Graph finished!')
      return { value: END }
    })

    workflow.addEdge('start', 'end')
    workflow.setEntryPoint('start')

    await this.langGraphService.runGraph(workflow)
    this.eventEmitterService.emit('graph_finished', { status: 'success' })
  }
}
