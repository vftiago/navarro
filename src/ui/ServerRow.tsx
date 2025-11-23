import { Flex } from "@mantine/core";

export const ServerRow = () => {
  return (
    <Flex gap="xs">
      {["HQ", "R&D", "Archives", "Remote"].map((element: string) => {
        return (
          <Flex
            className="bg-neutral-900 p-2.5 rounded-xl w-[192px]"
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
