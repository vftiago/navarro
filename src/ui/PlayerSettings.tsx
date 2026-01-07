import { Button, Drawer, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdSettings } from "react-icons/io";
import { setFullArt } from "../state/settings";
import { useGameStore } from "../state/store";

export const PlayerSettings = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const fullArt = useGameStore((state) => state.settingsState.fullArt);
  const dispatch = useGameStore((state) => state.dispatch);

  return (
    <>
      <Drawer opened={opened} title="Settings" onClose={close}>
        <Switch
          checked={fullArt}
          label="Full art"
          onChange={(event) => dispatch(setFullArt(event.currentTarget.checked))}
        />
      </Drawer>

      <Button color="gray" variant="filled" onClick={open}>
        <IoMdSettings size={20} />
      </Button>
    </>
  );
};
