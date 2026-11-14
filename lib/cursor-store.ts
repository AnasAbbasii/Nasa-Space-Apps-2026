export type CursorType = 'default' | 'button' | 'focus' | 'grabbing';

type Listener = (type: CursorType) => void;

let currentType: CursorType = 'default';
const listeners = new Set<Listener>();

export const cursorStore = {
  get: (): CursorType => currentType,
  set: (type: CursorType) => {
    if (currentType === type) return;
    currentType = type;
    listeners.forEach((listener) => listener(type));
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
