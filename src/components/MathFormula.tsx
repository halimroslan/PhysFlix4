"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathFormulaProps {
  latex: string;
  className?: string;
  displayMode?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  latex,
  className = "",
  displayMode = true
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false
      });
    } catch {
      return latex;
    }
  }, [latex, displayMode]);

  return (
    <div
      className={`katex-math-render overflow-x-auto select-all ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
