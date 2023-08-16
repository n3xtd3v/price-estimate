import { create } from "zustand";

const store = (store) => ({
  auth: {},
});

export const useStore = create(store);
