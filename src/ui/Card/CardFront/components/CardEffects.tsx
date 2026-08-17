import { Text, Tooltip } from "@mantine/core";
import { IoMdReturnRight } from "react-icons/io";
import type { EffectCost } from "../../../../cardDefinitions/card";
import type { CardTextLine } from "../../../../cards/engine";

const renderLineCosts = (costs: EffectCost[]) => {
  return costs.map((cost, index) => {
    return `${cost}${index >= costs.length - 1 ? ": " : ", "}`;
  });
};

export const CardEffects = ({ textLines }: { textLines: CardTextLine[] }) => {
  return textLines.map((line, index) => {
    const { costs, isSubroutine, keyword, reminderText, text } = line;

    return (
      <Text fw="500" key={index} size="xs">
        {isSubroutine ? (
          <span className="inline">
            <IoMdReturnRight className="-mt-0.5 inline" />{" "}
          </span>
        ) : null}

        {costs ? (
          <span className="inline">{renderLineCosts(costs)}</span>
        ) : null}

        {keyword ? (
          <Tooltip label={reminderText}>
            <span className="inline text-purple-300">{text}</span>
          </Tooltip>
        ) : (
          <span className="inline">{text}</span>
        )}
      </Text>
    );
  });
};
