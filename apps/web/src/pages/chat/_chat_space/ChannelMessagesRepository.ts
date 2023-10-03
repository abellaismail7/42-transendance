import { useQuery } from "react-query";
import { api } from "../globals";
import { z } from "zod";

const MessageScheme = z.array(
  z.object({
    id: z.string().uuid(),
    senderId: z.string().uuid(),
    channelId: z.string().uuid(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    content: z.string(),
  })
);

export function useChannelMessages(userId: string, channelId: string) {
  return useQuery(["messages", channelId], async () => {
    const { data } = await api.get("/channels/messages", {
      params: { userId, channelId },
    });
    return MessageScheme.parse(data);
  });
}
