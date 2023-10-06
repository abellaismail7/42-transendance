import { SearchChannelScheme } from "./SearchChannelDto";
import { ChannelsScheme } from "./ChannelDto";
import { useQuery } from "react-query";
import { api } from "../globals";

export function useChannels(userId: string) {
  return useQuery("channels", async () => {
    const { data } = await api.get(`/channels/user/${userId}`);
    return ChannelsScheme.parse(data);
  });
}

export type ChannelVisibility = "PROTECTED" | "PRIVATE" | "PUBLIC";

export type CreateChannelPayload = {
  name: string;
  ownerId: string;
  image: File | null;
  access: ChannelVisibility;
  password?: string;
};

export function createChannel(createPayload: CreateChannelPayload) {
  const formData = new FormData();
  formData.append("name", createPayload.name);
  formData.append("ownerId", createPayload.ownerId);
  formData.append("access", createPayload.access);
  if (createPayload.image) {
    formData.append("image", createPayload.image);
  }
  if (createPayload.password) {
    formData.append("password", createPayload.password);
  }
  return api.post("/channels/create", formData);
}

export type JoinRequestBody = {
  channelId: string;
  userId: string;
  password?: string;
};

export function joinChannel(request: JoinRequestBody) {
  return api.post("/channels/join", request);
}

export type SearchChannelsQueries = {
  userId: string;
  query: string;
};

export async function searchChannels({ query, userId }: SearchChannelsQueries) {
  const { data } = await api.get("/channels/search", {
    params: { q: query, userId },
  });
  return SearchChannelScheme.parse(data);
}
