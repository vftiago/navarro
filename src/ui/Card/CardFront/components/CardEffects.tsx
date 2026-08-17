import { Text, Tooltip } from "@mantine/core";
import { IoMdReturnRight } from "react-icons/io";
import {
  type CardEffect,
  type EffectCost,
  TriggerMoment,
} from "../../../../cardDefinitions/card";
import { getKeywordDefinition } from "../../../../cards/engine";

const renderEffectCosts = (costs: EffectCost[]) => {
  return costs.map((cost, index) => {
    return `${cost}${index >= costs.length - 1 ? ": " : ", "}`;
  });
};

export const CardEffects = ({ cardEffects }: { cardEffects: CardEffect[] }) => {
  if (!cardEffects) {
    return null;
  }

  const effects = cardEffects.map((effect, index) => {
    const { costs, getText, keyword, triggerMoment } = effect;

    const isSubroutine = triggerMoment === TriggerMoment.ON_ENCOUNTER;

    return (
      <Text fw="500" key={index} size="xs">
        {isSubroutine ? (
          <span className="inline">
            <IoMdReturnRight className="-mt-0.5 inline" />{" "}
          </span>
        ) : null}

        {costs ? (
          <span className="inline">{renderEffectCosts(costs)}</span>
        ) : null}

        {keyword ? (
          <Tooltip label={getKeywordDefinition(keyword).reminderText}>
            <span className="inline text-purple-300">{getText()}</span>
          </Tooltip>
        ) : (
          <span className="inline">{getText()}</span>
        )}
      </Text>
    );
  });

  return effects;
};
