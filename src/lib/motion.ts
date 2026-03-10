// BluSapiens Motion System
// Subtle, professional, calm animations

export const TIMING = {
  hover: 0.2,
  entrance: 0.5,
  stagger: 0.06,
  page: 0.35,
} as const;

export const EASE = {
  out: [0.25, 0.46, 0.45, 0.94] as const,
  inOut: [0.42, 0, 0.58, 1] as const,
};

// Reusable animation variants
export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.entrance, ease: EASE.out } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: TIMING.entrance, ease: EASE.out } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: TIMING.stagger,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: TIMING.entrance, ease: EASE.out } },
};

// Hero stagger for sequential reveals
export const heroStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const heroChild = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.out } },
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: TIMING.page, ease: EASE.out } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Viewport config for scroll reveals
export const viewport = { once: true, margin: "-60px" };
