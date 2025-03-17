export type Role = 'USER' | 'MANAGER' | 'ADMIN';
export interface User {
  username: string;
  email: string;
  role: Role;
  status_phrase: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  sent_at: string;
  updated_at: string;
}

export interface EnrichedMessage extends Message {
  sender: User;
}

export interface Conversation {
  conversation_id: number;
  conversation_name: string;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnrichedConversation extends Conversation {
  users: User[];
}

export interface PostMessage {
  conversationId: number;
  content: string;
}

export interface UserSentEvents {
  datatype: 'message';
  payload: PostMessage;
}

export interface MessageEvent {
  datatype: 'message';
  payload: Message;
}

export interface ConvCreationEvent {
  datatype: 'convCreation';
  payload: EnrichedConversation;
}

export type ServerSentEvents = MessageEvent | ConvCreationEvent;
