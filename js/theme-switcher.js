// Three-state theme switcher, same contract as the rest of the mimeo
// template family: localStorage key "theme" holds "light" | "dark" |
// "system"; the choice is applied as html[data-force-theme] plus a
// body.light-mode / body.dark-mode class. The inline <head> script in
// layouts/base.njk applies the saved preference before first paint.
(function () {
	"use strict";

	const STORAGE_KEY = "theme";

	const toggle = document.getElementById("theme-toggle");
	const options = document.getElementById("theme-options");
	if (!toggle || !options) return;

	const optionLinks = options.querySelectorAll(".theme-option");

	function applyTheme(theme) {
		try {
			if (theme === "light" || theme === "dark") {
				localStorage.setItem(STORAGE_KEY, theme);
			} else {
				localStorage.setItem(STORAGE_KEY, "system");
			}
		} catch (e) { /* private mode */ }

		document.body.classList.remove("light-mode", "dark-mode");

		if (theme === "light" || theme === "dark") {
			document.body.classList.add(theme + "-mode");
			document.documentElement.setAttribute("data-force-theme", theme);
		} else {
			document.documentElement.removeAttribute("data-force-theme");
		}

		markActive(theme);
		syncToggleGlyph();
	}

	function currentTheme() {
		try {
			return localStorage.getItem(STORAGE_KEY) || "system";
		} catch (e) {
			return "system";
		}
	}

	function markActive(theme) {
		optionLinks.forEach(function (link) {
			link.classList.toggle("active", link.dataset.theme === theme);
		});
	}

	function syncToggleGlyph() {
		const theme = currentTheme();
		toggle.textContent = theme === "light" ? "\u2600" : theme === "dark" ? "\u263D" : "\u25D1";
	}

	function closeMenu() {
		options.classList.remove("open");
		toggle.setAttribute("aria-expanded", "false");
	}

	toggle.addEventListener("click", function (event) {
		event.stopPropagation();
		const opening = !options.classList.contains("open");
		options.classList.toggle("open", opening);
		toggle.setAttribute("aria-expanded", opening ? "true" : "false");
	});

	optionLinks.forEach(function (link) {
		link.addEventListener("click", function (event) {
			event.preventDefault();
			applyTheme(link.dataset.theme);
			closeMenu();
		});
	});

	document.addEventListener("click", function (event) {
		if (options.classList.contains("open") && !options.contains(event.target)) {
			closeMenu();
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && options.classList.contains("open")) {
			closeMenu();
			toggle.focus();
		}
	});

	markActive(currentTheme());
	syncToggleGlyph();
})();
