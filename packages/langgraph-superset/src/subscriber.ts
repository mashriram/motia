import type { Event, Listener, Subscriber } from './types'

export class BasicSubscriber implements Subscriber {
  private listeners: Record<string, Listener[]> = {}

  subscribe(topic: string, listener: Listener): void {
    if (!this.listeners[topic]) {
      this.listeners[topic] = []
    }
    this.listeners[topic].push(listener)
  }

  unsubscribe(topic: string, listener: Listener): void {
    if (this.listeners[topic]) {
      this.listeners[topic] = this.listeners[topic].filter((l) => l !== listener)
    }
  }

  notify(event: Event): void {
    if (this.listeners[event.topic]) {
      this.listeners[event.topic].forEach((listener) => {
        listener(event)
      })
    }
  }
}
