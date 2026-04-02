import { Button, Drawer, Select, Stack, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdSettings } from "react-icons/io";
import { setCardSize, setFullArt } from "../state/settings";
import type { CardSize } from "../state/settings/types";
import { useGameStore } from "../state/store";

export const PlayerSettings = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const cardSize = useGameStore((state) => state.settingsState.cardSize);
  const fullArt = useGameStore((state) => state.settingsState.fullArt);
  const dispatch = useGameStore((state) => state.dispatch);

  return (
    <>
      <Drawer opened={opened} title="Settings" onClose={close}>
        <Stack>
          <Select
            data={[
              { label: "Extra small", value: "xs" },
              { label: "Small", value: "sm" },
            ]}
            label="Card size"
            value={cardSize}
            onChange={(value) => {
              if (value) dispatch(setCardSize(value as CardSize));
            }}
          />
          <Switch
            checked={fullArt}
            label="Full art"
            onChange={(event) =>
              dispatch(setFullArt(event.currentTarget.checked))
            }
          />
        </Stack>
      </Drawer>

      <Button color="gray" variant="filled" onClick={open}>
        <IoMdSettings size={20} />
      </Button>
    </>
  );
};
