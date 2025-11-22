import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, Flex } from "@mantine/core";
import { IoMdSettings } from "react-icons/io";

export const PlayerSettings = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Flex className="justify-end">
      <Drawer opened={opened} title="Settings" onClose={close}>
        {/* Drawer content */}
      </Drawer>

      <Button color="gray" variant="filled" onClick={open}>
        <IoMdSettings size={20} />
      </Button>
    </Flex>
  );
};
