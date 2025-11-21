export interface Graph {
  // A method to process an event and return an immediate response.
  processEvent(event: Event): Promise<Event>
  // A method to start a long-running task.
  startTask(event: Event): Promise<void>
}

export interface Event {
  topic: string
  data: any
  context: any
}

export type Listener = (event: Event) => void

export interface Subscriber {
  subscribe(topic: string, listener: Listener): void
  unsubscribe(topic: string, listener: Listener): void
}
