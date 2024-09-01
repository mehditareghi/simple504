"use client";

import { useEffect, useState } from "react";
import { Expand } from "@theme-toggles/react";
import "@theme-toggles/react/css/Expand.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Expand
      toggled={theme === "dark"}
      toggle={toggleTheme}
      duration={750} // Optional: Control the duration of the animation
      className="w-6 h-6"
    />
  );
}
