import {CoreMessage} from "ai";

export interface IChat {
  id: string;
  author: string;
  created_at: string;
  messages: CoreMessage[];
}