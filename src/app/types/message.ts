export interface Message {
  conversation_id: number;
  content: string;
  message_type: string;
}
export interface RecievedMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  isGroup: boolean;
  targets: Array<number>;
  conversation_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  message_type: string;
}
