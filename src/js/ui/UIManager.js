import { DataAttributesList } from "../constants.js";

export default class UIManager {
  /** @type {HTMLElement} */
  startColor = null;
  /** @type {HTMLElement} */
  endColor = null;
  /** @type {HTMLElement} */
  stopCount = null;
  /** @type {HTMLElement} */
  themeButton = null;
  /** @type {HTMLElement} */
  generateButton = null;
  /** @type {HTMLElement} */
  discretePreview = null;
  /** @type {HTMLElement} */
  continuousPreview = null;
  /** @type {HTMLElement} */
  stopList = null;
  /** @type {HTMLElement} */
  gradientEditor = null;
  /** @type {HTMLElement} */
  gradientTrack = null;

  constructor(app) {
    this.app = app;
  }

  init() {
    this.cacheDom();
    this.bindEvents();
  }

  cacheDom() {
    this.startColor = document.querySelector(`[${DataAttributesList.DataSettingsId}="startColor"]`);
    this.endColor = document.querySelector(`[${DataAttributesList.DataSettingsId}="endColor"]`);
    this.stopCount = document.querySelector(`[${DataAttributesList.DataSettingsId}="stopCount"]`);
    this.themeButton = document.querySelector("#themeButton");
    this.generateButton = document.querySelector("#generateStops");
    this.discretePreview = document.querySelector("#discretePreview");
    this.continuousPreview = document.querySelector("#continuousPreview");
    this.stopList = document.querySelector("#stopList");
    this.gradientEditor = document.querySelector("#gradientEditor");
    this.gradientTrack = document.querySelector("#gradientTrack");
  }

  bindEvents() {
    const store = this.app.store;

    this.startColor.addEventListener("input", (e) => {
      store.set("startColor", e.target.value);
    });

    this.endColor.addEventListener("input", (e) => {
      store.set("endColor", e.target.value);
    });

    this.stopCount.addEventListener("change", (e) => {
      store.set("stopCount", Number(e.target.value));
    });

    this.themeButton.addEventListener("click", () => {
      store.set("theme", store.get("theme") === "dark" ? "light" : "dark");
    });

    this.stopList.addEventListener("click", this.copyColorValue);
  }

  /**
   * @param {PointerEvent} e
   * @returns {Promise<void>}
   */
  copyColorValue = async (e) => {
    const target = e.currentTarget.contains(e.target) && e.target.closest("[data-color]");

    if (!target) return;

    const color = target.dataset.color;

    try {
      await navigator.clipboard.writeText(color);

      target.classList.add("copied");

      let indicator = target.querySelector(".copy-indicator");
      if (indicator) indicator.textContent = "Copied!";

      setTimeout(() => {
        target.classList.remove("copied");

        indicator = indicator?.isConnected ? indicator : target.querySelector(".copy-indicator");
        if (indicator) indicator.textContent = "Copy";
      }, 1200);

    } catch {
      console.error("Couldn't copy color");
    }
  };
}