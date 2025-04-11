import { useEffect, useState } from "react";
import { Flex, Text, Loader } from "@mantine/core";
import { motion } from "framer-motion";

export const CorpThinking = ({
  onComplete,
  thinkingTime = 2000,
}: {
  onComplete: () => void;
  thinkingTime?: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Give animation time to complete
    }, thinkingTime);

    return () => clearTimeout(timer);
  }, [onComplete, thinkingTime]);

  return (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex align="center" direction="column" gap="md">
        <Loader color="white" size="lg" type="dots" />
        <Text className="text-5xl italic uppercase font-bold">
          Corp thinking...
        </Text>
      </Flex>
    </motion.div>
  );
};
