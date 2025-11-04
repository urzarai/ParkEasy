import React, { useEffect, useState } from "react";
import { ThemeContext } from "./themeStore";

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		try {
			const stored = localStorage.getItem("theme");
			if (stored) return stored;
			// default to OS preference
			if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
				return "dark";
			}
			return "light";
		} catch {
			return "light";
		}
	});

	useEffect(() => {
		try {
			if (theme === "dark") document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", theme);
		} catch {
			// ignore
		}
	}, [theme]);

		const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

		return (
			<ThemeContext.Provider value={{ theme, toggleTheme }}>
				{children}
			</ThemeContext.Provider>
		);
}


