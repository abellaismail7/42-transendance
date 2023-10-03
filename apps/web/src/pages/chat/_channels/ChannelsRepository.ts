import { ChannelsScheme } from "../_dto/ChannelDto";
import { useQuery } from "react-query";
import { api } from "../globals";

export function useChannels(userId: string) {
  return useQuery("channels", async () => {
    const { data } = await api.get(`/channels/user/${userId}`);
    return ChannelsScheme.parse(data);
  });
}

export type ChannelVisibility = "PROTECTED" | "PRIVATE" | "PUBLIC";

export type CreateChannelProps = {
  name: string;
  ownerId: string;
  image: string;
  access: ChannelVisibility;
  password?: string;
};

export function createChannel(createPayload: CreateChannelProps) {
  return api.post("/channels/create", createPayload);
}
