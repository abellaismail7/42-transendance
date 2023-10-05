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
    sender: z
      .object({
        id: z.string().uuid(),
        username: z.string(),
        login: z.string(),
        image: z.string().url(),
      })
      .strict(),
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
