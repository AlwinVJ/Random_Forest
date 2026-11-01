import { useMemo } from "react";
import katex from "katex";

interface MathViewProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function MathView({ math, display = false, className = "" }: MathViewProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.warn("KaTeX render error:", err);
      return `<code class="font-mono text-xs">${math}</code>`;
    }
  }, [math, display]);

  if (display) {
    return (
      <div
        className={`my-2 overflow-x-auto py-2 text-center text-foreground ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle text-foreground ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
