import { Text } from "@mantine/core";
import {
  CardEffect,
  EffectCost,
  TriggerMoment,
} from "../../../../cardDefinitions/card";
import clsx from "clsx";
import { IoMdReturnRight } from "react-icons/io";

const renderEffectCosts = (costs: EffectCost[]) => {
  return costs.map((cost, index) => {
    return `${cost}${index >= costs.length - 1 ? ": " : ", "}`;
  });
};

export const CardEffects = ({
  cardEffects,
  size,
}: {
  cardEffects: CardEffect[];
  size: string;
}) => {
  if (!cardEffects) {
    return null;
  }

  const effects = cardEffects.map((effect, index) => {
    const { costs, keyword, triggerMoment, getText } = effect;

    const isKeyword = Boolean(keyword);

    const isSubroutine = triggerMoment === TriggerMoment.ON_ENCOUNTER;

    return (
      <Text key={index} fw="500" size={size}>
        {isSubroutine ? (
          <span className="inline">
            <IoMdReturnRight className="inline -mt-0.5" />{" "}
          </span>
        ) : null}

        {costs ? (
          <span className="inline">{renderEffectCosts(costs)}</span>
        ) : null}

        <span
          className={clsx("inline", {
            "text-purple-300": isKeyword,
          })}
        >
          {getText()}
        </span>
      </Text>
    );
  });

  return effects;
};
