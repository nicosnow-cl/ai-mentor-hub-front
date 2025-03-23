import { createStore } from "zustand/vanilla";

export type Message = {
  id: string;
  role: string;
  content: string;
  think?: string;
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
    appendMessage: (message: Message) => {
      console.log("New Message: ", message);

      set((state) => ({ ...state, messages: [...state.messages, message] }));
    },
  }));
};
