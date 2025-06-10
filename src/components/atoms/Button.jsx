import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', whileHover, whileTap, ...props }) => {
    // Only apply motion props if they are provided
    const MotionButton = whileHover || whileTap ? motion.button : 'button';

    return (
        <MotionButton
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
            {...props}
        >
            {children}
        </MotionButton>
    );
};

export default Button;