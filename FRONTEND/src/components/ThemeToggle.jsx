import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/useTheme";

function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className="theme-toggle"
			onClick={toggleTheme}
			aria-pressed={theme === "dark"}
			aria-label="Toggle dark mode"
			title={theme === "dark" ? "Switch to light" : "Switch to dark"}
		>
			<span className="theme-toggle-inner">
				{theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
			</span>
		</button>
	);
}

export default ThemeToggle;
