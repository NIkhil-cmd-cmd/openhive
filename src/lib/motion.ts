export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -32,
    transition: { duration: 0.45, ease: easeInOut },
  },
};

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.4, ease: easeInOut },
  },
};

export const slideX = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.4, ease: easeInOut },
  },
};
