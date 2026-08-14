import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const isClickedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Check if pointer is fine (desktop/mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        ringX = mouseX;
        ringY = mouseY;
      }

      // During active click/drag, keep ring strictly locked to mouse position
      if (isClickedRef.current) {
        ringX = mouseX;
        ringY = mouseY;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0px) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isClickedRef.current = true;
      setIsClicked(true);
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Instantly align ring center with dot upon clicking
      ringX = mouseX;
      ringY = mouseY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0px) translate(-50%, -50%)`;
      }
    };

    const onMouseUp = () => {
      isClickedRef.current = false;
      setIsClicked(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');
      setIsHovered(!!interactiveEl);
    };

    const onMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const onMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Smooth lerp loop for outer ring
    const renderLoop = () => {
      if (isClickedRef.current) {
        // Locked in center during clicking state
        ringX = mouseX;
        ringY = mouseY;
      } else {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0px) translate(-50%, -50%)`;
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  return (
    <div
      id="custom-cursor-container"
      className="hidden md:block pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Outer Smooth Trailing Ring - strictly avoids CSS transform transitions to prevent positioning drift */}
      <div
        ref={ringRef}
        id="cursor-outer-ring"
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-[width,height,opacity,border-color,background-color,box-shadow] duration-200 ease-out will-change-transform ${
          !isVisible ? 'opacity-0' : 'opacity-100'
        } ${
          isHovered
            ? 'w-14 h-14 border border-cream/70 bg-cream/[0.07] backdrop-blur-[0.5px]'
            : isClicked
            ? 'w-6 h-6 border border-cream/80 bg-cream/[0.2]'
            : 'w-8 h-8 border border-cream/35 bg-transparent'
        }`}
        style={{
          boxShadow: isHovered
            ? '0 0 20px rgba(239, 238, 233, 0.15)'
            : isClicked
            ? '0 0 12px rgba(239, 238, 233, 0.2)'
            : '0 0 10px rgba(239, 238, 233, 0.05)',
        }}
      />

      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        id="cursor-inner-dot"
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-[width,height,opacity,background-color] duration-150 ease-out will-change-transform ${
          !isVisible ? 'opacity-0' : 'opacity-100'
        } ${
          isHovered
            ? 'w-1.5 h-1.5 bg-cream opacity-90'
            : isClicked
            ? 'w-2 h-2 bg-cream opacity-100'
            : 'w-1.5 h-1.5 bg-cream opacity-100'
        }`}
      />
    </div>
  );
}
