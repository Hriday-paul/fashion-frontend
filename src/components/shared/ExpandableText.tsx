"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text?: string | null;
  lines?: number;
  className?: string;
  buttonClassName?: string;
  readMoreText?: string;
  readLessText?: string;
}

export default function ExpandableText({
  text,
  lines = 4,
  className,
  buttonClassName,
  readMoreText = "Read more",
  readLessText = "Read less",
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const checkOverflow = useCallback(() => {
    const el = textRef.current;
    if (!el) return;

    if (!isExpanded) {
      const isOverflowing = el.scrollHeight > el.clientHeight + 1;
      setCanExpand(isOverflowing);
    }
  }, [isExpanded]);

  useEffect(() => {
    checkOverflow();

    const el = textRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      checkOverflow();
    });

    observer.observe(el);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(checkOverflow);
    }

    return () => {
      observer.disconnect();
    };
  }, [checkOverflow, text]);

  if (!text || !text.trim()) {
    return null;
  }

  const lineClampClass = !isExpanded
    ? lines === 1
      ? "line-clamp-1"
      : lines === 2
      ? "line-clamp-2"
      : lines === 3
      ? "line-clamp-3"
      : lines === 5
      ? "line-clamp-5"
      : lines === 6
      ? "line-clamp-6"
      : "line-clamp-4"
    : "line-clamp-none";

  return (
    <div>
      <div
        ref={textRef}
        className={cn(
          "whitespace-pre-wrap break-words font-figtree leading-relaxed",
          lineClampClass,
          className
        )}
      >
        {text}
      </div>

      {(canExpand || isExpanded) && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            "mt-1.5 text-sm font-semibold underline text-foreground hover:opacity-80 transition-opacity cursor-pointer inline-block",
            buttonClassName
          )}
        >
          {isExpanded ? readLessText : readMoreText}
        </button>
      )}
    </div>
  );
}
