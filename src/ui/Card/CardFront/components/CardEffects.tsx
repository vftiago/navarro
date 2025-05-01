import { Text } from "@mantine/core";
import {
  CardEffect,
  EffectCost,
  TriggerMoment,
} from "../../../../cardDefinitions/card";
import clsx from "clsx";
import { TbClock2, TbTrash } from "react-icons/tb";
import { IoMdReturnRight } from "react-icons/io";

const renderEffectCosts = (costs: EffectCost[]) => {
  return costs.map((cost, index) => {
    switch (cost) {
      case EffectCost.TRASH:
        return (
          <span>
            <TbTrash className="inline -mt-0.5" size="1rem" />
            {index >= costs.length - 1 ? ": " : ", "}
          </span>
        );
      case EffectCost.CLICK:
        return (
          <span>
            <TbClock2 className="inline-flex items-center" size="1rem" />
            {index >= costs.length - 1 ? ": " : ", "}
          </span>
        );
      default:
        return null;
    }
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
