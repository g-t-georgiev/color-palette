// js/render/Renderer.js
export default class Renderer {
  constructor(app) {
    this.app = app;
    this.ui = app.ui;

    this.frame = null;
  }

  init() {
    const store = this.app.store;

    store.subscribe("theme", () => this.invalidate());
    store.subscribe("stops", () => this.invalidate());

    this.invalidate();
  }

  invalidate() {
    if (this.frame) return;

    this.frame = requestAnimationFrame(() => {
      this.frame = null;

      this.render();
    });
  }

  render() {
    this.renderTheme();
    this.renderGradient();
    this.renderDiscretePreview();
    this.renderStopList();
  }

  renderTheme() {
    document.documentElement.dataset.theme = this.app.store.get("theme");
  }

  renderGradient() {
    const stops = this.app.store.get("stops");

    if (!stops.length) return;

    const css = stops.map(s => `${s.color} ${s.position}%`).join(", ");

    this.ui.continuousPreview.innerHTML = `
        <div class="gradient-preview"
              style="background:linear-gradient(90deg, ${css})">
        </div>
    `;
  }

  renderDiscretePreview() {
    const stops = this.app.store.get("stops");

    this.ui.discretePreview.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "discrete-preview";

    stops.forEach((stop) => {
      const block = document.createElement("div");
      block.className = "color-block";
      block.style.background = stop.color;
      block.dataset.color = stop.color;
      block.dataset.label = Math.round(stop.position) + "%";
      wrapper.appendChild(block);
    });

    this.ui.discretePreview.appendChild(wrapper);
  }

  renderStopList() {
    const stops = this.app.store.get("stops");

    this.ui.stopList.innerHTML = "";

    stops.forEach((stop) => {
      const row = document.createElement("div");

      row.classList.add("stop-item");
      row.dataset.color = stop.color;
      row.dataset.label = Math.round(stop.position) + "%";

      row.innerHTML = `
      <div class="stop-swatch" style="background:${stop.color}"></div>

      <div>
        <strong>${stop.color}</strong><br>
        <span class="stop-position">${Math.round(stop.position).toFixed(1)}%</span>
      </div>
      
      <div class="copy-indicator">Copy</div>`;

      this.ui.stopList.appendChild(row);
    });
  }
}