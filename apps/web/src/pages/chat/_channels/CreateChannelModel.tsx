import { useMutation, useQueryClient } from "react-query";
import { ChannelVisibility } from "./ChannelsRepository";
import { createChannel } from "./ChannelsRepository";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  RadioGroup,
  ModalFooter,
  Button,
  Radio,
  Avatar,
  CircularProgress,
} from "@nextui-org/react";

export type CreateChannelForm = {
  visibility: ChannelVisibility;
  password?: string;
  image: File | null;
  name: string;
};

export type CreateChannelModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
  isOpen: boolean;
  userId: string;
};

type CreateChannelState = {
  image: File | null;
  displayImage: string;
  visibility: string;
  password: string;
  name: string;
};

function initialState(): CreateChannelState {
  return {
    displayImage: "",
    visibility: "PUBLIC",
    password: "",
    image: null,
    name: "",
  };
}

export function CreateChannelModal({
  onOpenChange,
  onClose,
  isOpen,
  userId,
}: CreateChannelModalProps) {
  const [state, setState] = useState(initialState());

  function updateState<
    K extends keyof CreateChannelState,
    V extends CreateChannelState[K]
  >(key: K, value: V) {
    setState((old) => ({ ...old, [key]: value }));
  }

  const queryClient = useQueryClient();

  const createChannelMuation = useMutation(createChannel, {
    onSuccess: () => queryClient.invalidateQueries("channels"),
  });

  useEffect(() => {
    if (createChannelMuation.isSuccess) {
      setState(initialState());
      onClose();
    }
  }, [createChannelMuation.isSuccess]);

  useEffect(() => {
    if (state.image !== null) {
      const url = URL.createObjectURL(state.image);
      updateState("displayImage", url);
      return () => URL.revokeObjectURL(url);
    }
  }, [state.image]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Create new channel
        </ModalHeader>
        <ModalBody>
          {createChannelMuation.isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <CircularProgress />
            </div>
          ) : (
            <form>
              <Avatar size="lg" src={state.displayImage} alt="" />
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files
                    ? event.target.files[0]
                    : null;
                  updateState("image", file);
                }}
              />
              <Input
                autoFocus
                placeholder="Channel name"
                variant="bordered"
                onChange={(event) => {
                  updateState("name", event.target.value);
                }}
                value={state.name}
              />
              <RadioGroup
                label="Select channel visibility"
                onValueChange={(visibility) => {
                  updateState("visibility", visibility);
                }}
                defaultValue={state.visibility}
              >
                <Radio value="PUBLIC">Public</Radio>
                <Radio value="PROTECTED">Protected</Radio>
                <Radio value="PRIVATE">Private</Radio>
              </RadioGroup>
              {state.visibility === "PROTECTED" && (
                <Input
                  placeholder="Channel password"
                  variant="bordered"
                  type="password"
                  onChange={(event) => {
                    updateState("password", event.target.value);
                  }}
                  value={state.password}
                />
              )}
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            onPress={() => {
              createChannelMuation.mutate({
                ownerId: userId,
                name: state.name,
                image: state.image,
                access: state.visibility as ChannelVisibility,
                password:
                  state.visibility === "PROTECTED" ? state.password : undefined,
              });
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
