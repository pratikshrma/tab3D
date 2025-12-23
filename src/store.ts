import { create } from 'zustand';

interface State {
  x: number;
  setX: (value: number) => void;
}

export const useStore = create<State>((set) => ({
  x: 0,
  setX: (value) => set({ x: value }),
}));
