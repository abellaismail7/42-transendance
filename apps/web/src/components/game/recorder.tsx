import { HTMLAttributes, useEffect, useRef } from "react";

interface KeyRecorderProps extends HTMLAttributes<HTMLDivElement> {
  handleKeyDown?: (code: string) => void;
  handleKeyUp?: (code: string) => void;
}

export function KeyRecorder({
  handleKeyUp,
  handleKeyDown,
  ...props
}: KeyRecorderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = ref.current;
    const onKeyDown = (e: KeyboardEvent) => {
      handleKeyDown?.(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      handleKeyUp?.(e.code);
    };

    ref.current.addEventListener("keydown", onKeyDown);
    ref.current.addEventListener("keyup", onKeyUp);

    return () => {
      div.removeEventListener("keydown", onKeyDown);
      div.removeEventListener("keyup", onKeyUp);
    };
  }, [handleKeyUp, handleKeyDown]);

  return <div ref={ref} {...props} tabIndex={0} />;
}
