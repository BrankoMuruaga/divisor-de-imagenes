import React, { useRef, useEffect } from "react";
import "wired-elements";

const WiredRadio = ({
  checked,
  onChange,
  name,
  value,
  size = 20,
  className = "",
}) => {
  const radioRef = useRef(null);

  useEffect(() => {
    const el = radioRef.current;
    if (!el) return;

    if (checked) {
      el.setAttribute("checked", "");
    } else {
      el.removeAttribute("checked");
    }

    const handleChange = (e) => {
      if (e.detail.checked) {
        onChange?.(value);
      }
    };

    el.addEventListener("change", handleChange);
    return () => el.removeEventListener("change", handleChange);
  }, [checked, onChange, value]);

  return (
    <wired-radio
      ref={radioRef}
      name={name}
      value={value}
      className={`cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default WiredRadio;
