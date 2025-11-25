import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { CardType } from "../../cardDefinitions/card";

export const CardHoverEffect = ({
  children,
  type,
}: {
  children: ReactNode;
  type: CardType;
}) => {
  const [flashKey, setFlashKey] = useState(0);

  const boxShadow =
    type === CardType.AGENDA
      ? "0 0 4px 2px rgba(255, 255, 255, 0.8), 0 0 8px 4px rgba(252, 240, 120, 0.6), 0 0 24px 8px rgba(253, 240, 200, 0.4)"
      : "0 0 4px 2px rgba(255, 255, 255, 0.8), 0 0 8px 4px rgba(165, 243, 252, 0.6), 0 0 24px 8px rgba(103, 232, 249, 0.4)";

  return (
    <motion.div
      className="relative overflow-hidden rounded-md"
      whileHover={{
        boxShadow,
        transition: {
          boxShadow: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      }}
      onHoverStart={() => {
        setFlashKey((prev) => prev + 1);
      }}
    >
      {children}
      {flashKey ? (
        <motion.div
          animate={{
            opacity: [0, 0.8, 0],
            x: ["-100%", "100%"],
          }}
          className="hover:border-cyan-200 absolute inset-0 pointer-events-none scale-200"
          initial={{ opacity: 0, x: "-100%" }}
          key={flashKey}
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.3) 55%, transparent 70%)",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      ) : null}
    </motion.div>
  );
};
