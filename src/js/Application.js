import Store from "./core/Store.js";
import EventBus from "./core/EventBus.js";

import UIManager from "./ui/UIManager.js";
import Renderer from "./render/renderer.js";
import GradientEditor from "./editor/GradientEditor.js";
import ColorEngine from "./color/ColorEngine.js";
import { StateKeys } from "./constants.js";

export default class Application {
  constructor() {
    this.store = new Store({
      theme: "dark",
      interpolation: "oklch",
      outputFormat: "hex",
      startColor: "#3b82f6",
      endColor: "#ef4444",
      stopCount: 8,
      stops: [],
      selectedStop: null,
    });

    this.events = new EventBus();
    this.ui = new UIManager(this);
    this.renderer = new Renderer(this);
    this.editor = new GradientEditor(this);
    this.colors = new ColorEngine();
  }

  init() {
    this.ui.init();

    this.generatePalette();

    this.editor.init();
    this.renderer.init();

    const regenerate = () => this.generatePalette();

    this.store.subscribe(StateKeys.START_COLOR, regenerate);
    this.store.subscribe(StateKeys.END_COLOR, regenerate);
    this.store.subscribe(StateKeys.STOP_COUNT, regenerate);
  }

  generatePalette() {
    const store = this.store;

    const palette = this.colors.generate(
      store.get(StateKeys.START_COLOR),
      store.get(StateKeys.END_COLOR),
      store.get(StateKeys.STOP_COUNT)
    );

    store.set(StateKeys.STOPS, palette);
  }
}