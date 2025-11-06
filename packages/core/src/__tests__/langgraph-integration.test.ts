import { END, StateGraph } from '@langchain/langgraph'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { EventManager } from '../event-manager'
import { EventEmitterService } from '../nestjs/event-emitter.service'
import { LangGraphModule } from '../nestjs/langgraph.module'
import { LangGraphService } from '../nestjs/langgraph.service'

describe('LangGraph Integration', () => {
  let app: INestApplication
  let langGraphService: LangGraphService
  let eventEmitterService: EventEmitterService

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [LangGraphModule],
      providers: [
        EventEmitterService,
        {
          provide: 'EventManager',
          useFactory: () => ({
            emit: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
          }),
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    langGraphService = moduleFixture.get<LangGraphService>(LangGraphService)
    eventEmitterService = moduleFixture.get<EventEmitterService>(EventEmitterService)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should run a simple graph', async () => {
    const workflow = new StateGraph({
      channels: {
        value: {
          value: (x, y) => y,
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
    workflow.addEdge('end', END)
    workflow.setEntryPoint('start')

    const result = await langGraphService.runGraph(workflow)
    expect(result.value).toBe(END)
  })
})
