// 创建简单的 EventBus
export const eventBus = {
  events: new Map<string, Function[]>(),
  on(event: string, callback: Function) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event)?.push(callback);
  },
  off(event: string, callback: Function) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(
        event,
        callbacks.filter((cb) => cb !== callback),
      );
    }
  },
  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach((cb) => cb(...args));
  },
};
