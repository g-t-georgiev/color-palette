export class EventBus {
  constructor() {
    this.events = {};
  }

  on(name, callback) {
    this.events[name] ??= [];
    this.events[name].push(callback);
  }

  emit(name, payload) {
    if (!this.events[name]) return;

    this.events[name].forEach(cb => cb(payload));
  }
}

export default EventBus;