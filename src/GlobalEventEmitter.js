class GlobalEventEmitter extends EventTarget {
    emit(eventName, data) {
      this.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
  }
  
  export const globalEmitter = new GlobalEventEmitter();