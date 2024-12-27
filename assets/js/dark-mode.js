class DarkMode {
  constructor() {
    this.darkMode = localStorage.getItem("darkMode") === "enabled";
    this.toggleButton = document.getElementById("darkModeToggle");
    this.init();
  }

  init() {
    if (this.darkMode) {
      document.body.classList.add("dark-mode");
    }

    this.toggleButton.addEventListener("click", () => this.toggleDarkMode());
    this.updateButtonIcon();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", this.darkMode ? "enabled" : "disabled");
    this.updateButtonIcon();
  }

  updateButtonIcon() {
    const icon = this.toggleButton.querySelector("i");
    icon.className = this.darkMode ? "fas fa-sun" : "fas fa-moon";
  }
}

new DarkMode();
