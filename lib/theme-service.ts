// Theme Service for managing light/dark mode settings
export const themeService = {
  getStoredTheme(): "light" | "dark" | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("theme") as "light" | "dark" | null
  },

  setTheme(theme: "light" | "dark") {
    if (typeof window === "undefined") return
    localStorage.setItem("theme", theme)
    const html = document.documentElement
    if (theme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  },

  getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  },

  initializeTheme() {
    const stored = this.getStoredTheme()
    const system = this.getSystemTheme()
    const theme = stored || system
    this.setTheme(theme)
  },
}
