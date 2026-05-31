"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  /** CSS width value — defaults to 100% to fill its container */
  width?: string | number;
  /** Optional additional inline styles on the wrapper */
  style?: React.CSSProperties;
  /** Optional class on the wrapper element */
  className?: string;
  /** 'desktop' uses the 4:5 portrait .headshot class; 'web' is a looser square hero crop */
  variant?: "desktop" | "web";
}

export default function Headshot({
  width,
  style,
  className,
  variant = "desktop",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (variant === "web") {
    // Only set inline width when an explicit number/non-auto string is given.
    // 'auto' or omitted → CSS owns the width (avoids inline overriding responsive rules).
    const hasExplicitWidth = width !== undefined && width !== "auto";
    const wrapStyle: React.CSSProperties = {
      ...(hasExplicitWidth ? { width } : {}),
      aspectRatio: "4 / 5",
      borderRadius: "var(--radius)",
      border: "1px solid var(--line)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      background: "var(--paper-2)",
      ...style,
    };

    if (failed) {
      return (
        <div
          className={className}
          style={{
            ...wrapStyle,
            display: "flex",
            alignItems: "flex-end",
            padding: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--muted)",
            }}
          >
            // image.404
          </span>
        </div>
      );
    }

    return (
      <div className={className} style={wrapStyle}>
        <Image
          src="/headshot.webp"
          alt="Aneeshram Bhat"
          fill
          sizes="(max-width: 720px) 160px, 260px"
          style={{ objectFit: "cover", objectPosition: "top center" }}
          priority
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  // ── desktop variant — uses the existing .headshot class for shape/border/shadow
  if (failed) {
    return (
      <div
        className="headshot"
        style={{ justifyContent: "center", alignItems: "center", ...style }}
      >
        // image.404
      </div>
    );
  }

  return (
    <div
      className="headshot"
      style={{ padding: 0, overflow: "hidden", position: "relative", ...style }}
    >
      <Image
        src="/headshot.webp"
        alt="Aneeshram Bhat"
        fill
        sizes="300px"
        style={{ objectFit: "cover", objectPosition: "top center" }}
        priority
        onError={() => setFailed(true)}
      />
    </div>
  );
}
