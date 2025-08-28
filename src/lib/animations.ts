// lib/animations.ts
import { Variants, Transition } from 'framer-motion';

// ===== ANIMATION VARIANTS =====

// Basic fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// Slide animations
export const slideLeftVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export const slideRightVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

// Full slide variants (like in your Contact component)
export const fullSlideLeftVariants: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 1,
      ease: 'easeOut',
    } as Transition
  }
};

export const fullSlideRightVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 1,
      ease: 'easeOut',
    } as Transition
  }
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const scaleUpVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const fastStaggerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const slowStaggerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Your existing parent variants from Contact component
export const parentVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

// Rotation animations
export const rotateVariants: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  show: { 
    rotate: 0, 
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

// Flip animations
export const flipVariants: Variants = {
  hidden: { rotateY: 90, opacity: 0 },
  show: { 
    rotateY: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// ===== HOVER & TAP ANIMATIONS =====

export const buttonHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

export const buttonTap = {
  scale: 0.95
};

export const cardHover = {
  y: -5,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  transition: { duration: 0.3 }
};

export const scaleHover = {
  scale: 1.02,
  transition: { duration: 0.3 }
};

// ===== VIEWPORT SETTINGS =====

export const defaultViewport = {
  once: true,
  amount: 0.25
};

export const largeViewport = {
  once: true,
  amount: 0.5
};

export const smallViewport = {
  once: true,
  amount: 0.1
};

// ===== TRANSITION PRESETS =====

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
};

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: 'easeOut'
};

export const fastTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut'
};

export const slowTransition: Transition = {
  duration: 1.2,
  ease: 'easeOut'
};

// ===== LOADING ANIMATIONS =====

export const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ===== PAGE TRANSITION VARIANTS =====

export const pageVariants: Variants = {
  initial: { opacity: 0, x: 300 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -300 }
};

export const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// ===== COMPLEX ANIMATIONS =====

// Floating animation
export const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Typewriter effect
export const typewriterVariants: Variants = {
  hidden: { width: 0 },
  show: {
    width: 'auto',
    transition: {
      duration: 2,
      ease: 'linear'
    }
  }
};

// Gradient text animation (to be used with CSS)
export const gradientTextVariants: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// ===== UTILITY FUNCTIONS =====

// Create custom stagger container
export const createStaggerContainer = (staggerDelay: number = 0.1, childrenDelay: number = 0.2): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childrenDelay
    }
  }
});

// Create custom slide variant
export const createSlideVariant = (direction: 'left' | 'right' | 'up' | 'down', distance: number = 50): Variants => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -distance, opacity: 0 };
      case 'right': return { x: distance, opacity: 0 };
      case 'up': return { y: -distance, opacity: 0 };
      case 'down': return { y: distance, opacity: 0 };
    }
  };

  return {
    hidden: getInitialPosition(),
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };
};

// Create custom delay variant
export const createDelayedVariant = (baseVariant: Variants, delay: number): Variants => ({
  ...baseVariant,
  show: {
    ...baseVariant.show,
    transition: {
      ...(baseVariant.show as any)?.transition,
      delay
    }
  }
});

// Timeline stagger for items in a vertical timeline
export const timelineStaggerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

// Connector line animation (e.g., vertical line appearing from top to bottom)
export const connectorVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0
  },
  show: {
    height: "100%",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// Timeline dot animation (e.g., popping in with a scale)
export const timelineDotVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};


export default {
  fadeVariants,
  fadeUpVariants,
  fadeDownVariants,
  slideLeftVariants,
  slideRightVariants,
  fullSlideLeftVariants,
  fullSlideRightVariants,
  scaleVariants,
  scaleUpVariants,
  staggerContainerVariants,
  fastStaggerContainerVariants,
  slowStaggerContainerVariants,
  parentVariants,
  rotateVariants,
  flipVariants,
  buttonHover,
  buttonTap,
  cardHover,
  scaleHover,
  defaultViewport,
  largeViewport,
  smallViewport,
  springTransition,
  smoothTransition,
  fastTransition,
  slowTransition,
  spinVariants,
  pulseVariants,
  pageVariants,
  pageTransition,
  floatingVariants,
  typewriterVariants,
  gradientTextVariants,
  createStaggerContainer,
  createSlideVariant,
  createDelayedVariant,
    timelineStaggerVariants,
    connectorVariants,
    timelineDotVariants
};