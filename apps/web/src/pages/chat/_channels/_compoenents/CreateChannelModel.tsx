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
} from "@nextui-org/react";

import { useState } from "react";
import { ChannelVisibility } from "../ChannelsRepository";

export type CreateChannelForm = {
  name: string;
  visibility: ChannelVisibility;
  password?: string;
};

export type CreateChannelModalProps = {
  onOpenChange: () => void;
  createChannel: (props: CreateChannelForm) => void;
  isOpen: boolean;
};

type CreateChannelState = {
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
    visibility: "PUBLIC",
    password: "",
    name: "",
  });

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
