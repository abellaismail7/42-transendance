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
} from "@nextui-org/react";

import { useEffect, useState } from "react";
import { ChannelVisibility } from "./ChannelsRepository";
import { read } from "fs";

export type CreateChannelForm = {
  visibility: ChannelVisibility;
  password?: string;
  image: File | null;
  name: string;
};

export type CreateChannelModalProps = {
  onOpenChange: () => void;
  createChannel: (props: CreateChannelForm) => void;
  isOpen: boolean;
};

type CreateChannelState = {
  image: File | null;
  displayImage: string;
  visibility: string;
  password: string;
  name: string;
};

export function CreateChannelModal({
  isOpen,
  onOpenChange,
  createChannel,
}: CreateChannelModalProps) {
  const [state, setState] = useState<CreateChannelState>({
    displayImage: "",
    visibility: "PUBLIC",
    password: "",
    image: null,
    name: "",
  });

  useEffect(() => {
    if (state.image !== null) {
      const url = URL.createObjectURL(state.image);
      setState((old) => ({ ...old, displayImage: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [state.image]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new channel
              </ModalHeader>
              <ModalBody>
                <form>
                  <Avatar size="lg" src={state.displayImage} alt="" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files
                        ? event.target.files[0]
                        : null;
                      setState((old) => ({ ...old, image: file }));
                    }}
                  />
                  <Input
                    autoFocus
                    placeholder="Channel name"
                    variant="bordered"
                    onChange={(event) => {
                      setState((old) => ({ ...old, name: event.target.value }));
                    }}
                    value={state.name}
                  />
                  <RadioGroup
                    label="Select channel visibility"
                    onValueChange={(visibility) => {
                      setState((old) => ({ ...old, visibility }));
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
                        setState((old) => ({
                          ...old,
                          password: event.target.value,
                        }));
                      }}
                      value={state.password}
                    />
                  )}
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    createChannel({
                      name: state.name,
                      visibility: state.visibility as ChannelVisibility,
                      password:
                        state.visibility === "PROTECTED"
                          ? state.password
                          : undefined,
                      image: state.image,
                    });
                    onClose();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
