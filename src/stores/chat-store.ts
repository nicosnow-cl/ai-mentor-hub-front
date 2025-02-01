import { createStore } from "zustand/vanilla";

export type Message = {
  role: string;
  content: string;
};

export type ChatState = {
  messages: Message[];
};

export type ChatActions = {
  appendMessage: (message: Message) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
  messages: [],
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    appendMessage: (message: Message) =>
      set((state) => ({ ...state, messages: [...state.messages, message] })),
  }));
};
