import { StateKeys } from "../constants.js";

export default class GradientEditor {

  pointerId = null;
  draggingStop = null;
  trackRect = null;

  /**
   * @param {import("../Application.js").default} app 
   */
  constructor(app) {
    this.app = app;
    this.ui = app.ui;

    this.store = app.store;

    this.beginDrag = this.beginDrag.bind(this);
  }

  init() {
    this.store.subscribe(StateKeys.STOPS, () => this.render());
    this.store.subscribe(StateKeys.SELECTED_STOP, () => this.render());

    this.render();
  }

  render() {
    const track = this.ui.gradientTrack;

    this.clearGradientTrack(track);
    this.renderHandles(track, this.createColorStops(track));
  }

  /**
   * @param {number} id 
   */
  select(id) {
    this.store.set(StateKeys.SELECTED_STOP, id);
  }

  /**
   * @param {PointerEvent} event 
   */
  beginDrag(event) {
    const id = event.currentTarget.dataset.id;

    this.select(id);

    this.pointerId = event.pointerId;
  }

  drag() { }

  endDrag() { }

  /**
   * @param {{ id: number; position: number; color: string; }} stop
   * @param {boolean} selected
   * @returns {HTMLElement}
   */
  createHandle(stop, selected) {
    const handle = document.createElement("div");

    handle.dataset.id = stop.id;

    handle.classList.add("stop");

    if (stop.id === selected)
      handle.classList.add("selected");

    handle.style.left = stop.position + "%";
    handle.style.background = stop.color;

    //--------------------------------
    // Selection
    //--------------------------------
    handle.addEventListener("pointerdown", this.beginDrag);

    return handle;
  }

  /**
   * @param {HTMLElement} track
   * @param {{ id: number; position: number; color: string; }[]} stops 
   */
  renderHandles(track, stops) {
    const selected = this.store.get(StateKeys.SELECTED_STOP);

    //--------------------------------
    // Draw handles
    //--------------------------------
    stops.forEach((stop) => {
      const handle = this.createHandle(stop, selected);

      track.appendChild(handle);
    });
  }

  /**
   * @param {HTMLElement} track 
   */
  createColorStops(track) {
    /**
     * @type {{ id: number; position: number; color: string; }[]}
     */
    const stops = this.store.get(StateKeys.STOPS);

    //--------------------------------
    // Draw gradient
    //--------------------------------
    track.style.background =
      "linear-gradient(90deg," + stops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(",") + ")";

    return stops;
  }

  /**
   * @param {HTMLElement} track 
   */
  clearGradientTrack(track) {
    //--------------------------------
    // Clear old handles
    //--------------------------------
    track.innerHTML = "";
  }
}