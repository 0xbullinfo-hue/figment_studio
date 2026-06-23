import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        // Disable custom cursor listeners entirely on touchscreen/coarse-pointer devices
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const tagName = target.tagName.toLowerCase();
            const isInteractiveTag =
                tagName === 'button' ||
                tagName === 'a' ||
                tagName === 'input' ||
                tagName === 'select' ||
                tagName === 'textarea';

            if (
                isInteractiveTag ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('.cursor-pointer') ||
                target.getAttribute('role') === 'button'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[9999] hidden lg:block"
                animate={{
                    x: mousePosition.x - 6,
                    y: mousePosition.y - 6,
                    scale: isHovering ? 3 : 1,
                    backgroundColor: isHovering ? 'rgba(var(--color-primary), 0.2)' : 'var(--color-primary)'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9998] hidden lg:block"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
            />
        </>
    );
};

export default CustomCursor;

