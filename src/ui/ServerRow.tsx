import { Flex } from "@mantine/core";

export const ServerRow = () => {
  return (
    <Flex gap="xs">
      {["HQ", "R&D", "Archives", "Remote"].map((element: string) => {
        return (
          <Flex
            className="w-[192px] rounded-md bg-neutral-900 p-2.5"
            gap="xs"
            key={element}
          >
            {element}
          </Flex>
        );
      })}
    </Flex>
  );
};
