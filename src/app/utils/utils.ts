import {
  EnrichedConversation,
  EnrichedMessage,
  Message,
  User,
} from '../types/types';

export function getOtherUsers(
  enrichedConversation: EnrichedConversation,
  currentUser: User
) {
  return enrichedConversation.users.filter(
    (user) => user.id !== currentUser.id
  );
}

export function enrichMessages(
  messages: Message[],
  enrichedConversation: EnrichedConversation
): EnrichedMessage[] {
  return messages.reduce<EnrichedMessage[]>((acc, message) => {
    const sender = enrichedConversation.users.find(
      (user) => user.id === message.sender_id
    );
    if (sender) {
      acc.push({ ...message, sender });
    }
    return acc;
  }, []);
}
