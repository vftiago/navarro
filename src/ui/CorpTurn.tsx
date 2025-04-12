import { Flex, Text, Loader } from "@mantine/core";
import { motion } from "framer-motion";

export const CorpTurn = () => {
  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Flex align="center" direction="column" gap="md">
        <Loader color="white" size="lg" type="dots" />
        <Text className="text-3xl italic uppercase">Thinking...</Text>
      </Flex>
    </motion.div>
  );
};
