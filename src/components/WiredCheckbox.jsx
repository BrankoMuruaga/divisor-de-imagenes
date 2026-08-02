// WiredCheckbox.jsx
import React, { useRef, useEffect } from "react";
import "wired-elements";

const WiredCheckbox = ({ checked, onChange, size = 20, className = "" }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    const el = checkboxRef.current;
    if (!el) return;

    if (checked) {
      el.setAttribute("checked", "");
    } else {
      el.removeAttribute("checked");
    }

    const handleChange = (e) => {
      onChange?.(e.detail.checked);
    };

    el.addEventListener("change", handleChange);
    return () => el.removeEventListener("change", handleChange);
  }, [checked, onChange]);

  return (
    <wired-checkbox
      ref={checkboxRef}
      className={`cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default WiredCheckbox;
