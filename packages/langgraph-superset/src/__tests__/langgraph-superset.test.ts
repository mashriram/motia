import { AsyncGraph } from '../graph'
import { BasicSubscriber } from '../subscriber'
import type { Event } from '../types'

describe('LangGraph Superset Framework', () => {
  it('should return an interim response with a task ID', async () => {
    const subscriber = new BasicSubscriber()
    const graph = new AsyncGraph(subscriber)

    const event: Event = {
      topic: 'user_message',
      data: {
        message: 'Hello, world!',
      },
      context: {},
    }

    const interimResponse = await graph.processEvent(event)
    expect(interimResponse.topic).toBe('interim_response')
    expect((interimResponse.data as any).taskId).toBeDefined()
  })

  it('should start a task and notify the subscriber with the correct task ID', (done) => {
    const subscriber = new BasicSubscriber()
    const graph = new AsyncGraph(subscriber)

    const event: Event = {
      topic: 'user_message',
      data: {
        message: 'Hello, world!',
      },
      context: {},
    }

    graph.processEvent(event).then((interimResponse) => {
      const taskId = (interimResponse.data as any).taskId

      subscriber.subscribe('task_finished', (e) => {
        expect(e.topic).toBe('task_finished')
        expect(e.context.taskId).toBe(taskId)
        done()
      })

      graph.startTask({ ...event, data: { ...event.data, taskId } })
    })
  })
})
