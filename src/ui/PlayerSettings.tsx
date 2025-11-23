import { Drawer, Button, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdSettings } from "react-icons/io";

export const PlayerSettings = () => {
  const [opened, { close, open }] = useDisclosure(false);

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
