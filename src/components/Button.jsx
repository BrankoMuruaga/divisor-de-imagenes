import React, { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

const Button = ({ onClick, children, className = "", active = false }) => {
  const btnRef = useRef(null);
  const annotationRef = useRef(null);

  useEffect(() => {
    if (!btnRef.current || !active) return;

    const annotation = annotate(btnRef.current, {
      type: "circle",
      padding: 6,
      iterations: 2,
      color: "var(--color-active)",
    });
    annotationRef.current = annotation;
    annotation.show();

    const reposition = () => {
      annotationRef.current.animate = false;
      annotationRef.current.hide();
      annotationRef.current.show();
    };

    const scrollParent = btnRef.current.closest(
      "[class*='overflow-auto'], [class*='overflow-y-auto'], [class*='overflow-scroll']",
    );

    window.addEventListener("resize", reposition);
    scrollParent?.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("scroll", reposition, { passive: true });

    return () => {
      window.removeEventListener("resize", reposition);
      scrollParent?.removeEventListener("scroll", reposition);
      window.removeEventListener("scroll", reposition);
      annotation.remove();
    };
  }, [active]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 rounded-lg text-sm border transition-colors border-gray-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
