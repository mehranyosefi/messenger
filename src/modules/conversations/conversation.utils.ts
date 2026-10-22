export const createConversationKey = (userA: string, userB: string): string => {
  return [userA, userB].sort().join(":");
};
