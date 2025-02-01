"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // Detect system theme on first render
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    // Listen for changes in system theme
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Keep track of the current time
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      button.style.setProperty("--x", `${x}px`);
      button.style.setProperty("--y", `${y}px`);
    }
  };

  // Updated styles for a more natural light-mode button
  const dynamicStyles: { [key: string]: React.CSSProperties } = {
    container: {
      backgroundColor: theme === "dark" ? "#000" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    qrCode: {
      marginBottom: "20px",
    },
    githubButton: {
      position: "absolute",
      bottom: "20px",
      padding: "10px 20px",
      borderRadius: "12px",
      // Make the button more subtle in light mode
      background:
        theme === "dark"
          ? "rgba(255, 255, 255, 0.1)" // semi-transparent white on dark
          : "rgba(0, 0, 0, 0.05)", // very light overlay on white
      backdropFilter: "blur(10px)",
      color: theme === "dark" ? "#fff" : "#333", // a slightly darker text in light mode
      textDecoration: "none",
      fontWeight: 500,
      border:
        theme === "dark"
          ? "1px solid rgba(255, 255, 255, 0.3)"
          : "1px solid rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      // A slight box shadow in light mode for "lift"
      boxShadow: theme === "dark" ? "none" : "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    icon: {
      fontSize: "18px",
    },
  };

  return (
    <div style={dynamicStyles.container}>
      {time && (
        <QRCodeCanvas
          value={time}
          size={256}
          // Swap QR code colors based on theme
          bgColor={theme === "dark" ? "#000000" : "#FFFFFF"}
          fgColor={theme === "dark" ? "#FFFFFF" : "#000000"}
          style={dynamicStyles.qrCode}
        />
      )}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        style={dynamicStyles.githubButton}
        ref={buttonRef}
        onMouseMove={handleMouseMove}
      >
        <FaGithub style={dynamicStyles.icon} />
        GitHub
      </a>

      {/* CSS for the transparent, smooth cursor shadow */}
      <style jsx>{`
        a {
          position: relative;
          overflow: hidden;
        }

        a::before {
          content: "";
          position: absolute;
          top: var(--y, 50%);
          left: var(--x, 50%);
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 80%
          );
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
          pointer-events: none;
          border-radius: 50%;
        }

        a:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
