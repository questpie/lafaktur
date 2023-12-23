import React, { useCallback } from "react";

export function useDisclosure(defaultValue = false) {
  const [isOpen, setIsOpen] = React.useState(defaultValue);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggle,
  };
}
