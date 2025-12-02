import { Text } from "@mantine/core";
import { motion } from "framer-motion";

export const CorpTurn = () => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        type: "tween",
      }}
    >
      <motion.div
        animate={{ x: 0 }}
        exit={{ x: "100vw" }}
        initial={{ x: "-100vw" }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
          type: "tween",
        }}
      >
        <Text className="font-orbitron text-8xl font-bold uppercase italic">
          Corp Turn
        </Text>
      </motion.div>
    </motion.div>
  );
};
