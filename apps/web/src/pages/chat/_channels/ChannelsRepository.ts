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
  image: File | null;
  access: ChannelVisibility;
  password?: string;
};

export function createChannel(createPayload: CreateChannelProps) {
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
