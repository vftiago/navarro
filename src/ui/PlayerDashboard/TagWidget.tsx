import { AnimatePresence, motion } from "framer-motion";
import { TbTag } from "react-icons/tb";

export const TagWidget = ({ tagCount }: { tagCount: number }) => {
  return (
    <div>
      <ul className="flex flex-wrap gap-2.5">
        <AnimatePresence>
          {Array.from({ length: tagCount }).map((_, index) => (
            <motion.li
              key={index}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 2,
                transition: {
                  ease: "backIn",
                },
              }}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              whileHover={{
                scale: 1.1,
              }}
            >
              <TbTag size="1.5rem" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};
