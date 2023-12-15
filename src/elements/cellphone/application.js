import GameElement from "../game-element.js";

export default class Application extends GameElement {
  constructor(name, spriteName) {
    super(name, spriteName);
    this.icon = spriteName;

    // Create a list of listeners that can be created/cancelled when app is open/closed
    this.listeners = [];

    this.initial.opacity *= 0.5; // Half of parents opacity because layered transparents become more opaque.
  }

  /**
   * Draw the app's icon when the phone "starts up"
   * and define onClick behavior.
   *
   * @param {GameObj} parentObject
   */
  initialize(parentObject) {
    super.initialize(parentObject);

    // Open/close app on click.
    this.gameObj.onClick(() => {
      const app = this.name;
      if (StuckGame.Cellphone.apps.current === app) return;
      StuckGame.Cellphone.startApp(app);
    });
  }

  getComponents() {
    const parentComponents = super.getComponents();
    return [...parentComponents, scale(0.3), area()];
  }

  /**
   * Start the app and create associated listeners.
   */
  async start() {
    await this.startAnimation();
    this.setApplicationListeners();
  }

  /**
   * Close the app and cancel associated listeners.
   */
  async close() {
    // Flatten listeners array because there may be nested listeners.
    this.listeners.flat().forEach((listener) => listener.cancel());
    await this.closeAnimation();
  }

  /**
   * Override this for individual apps.
   */
  startAnimation() {
    // Override this for individual apps.
  }

  /**
   * Override this for individual apps.
   */
  closeAnimation() {
    // Override this for individual apps.
  }

  /**
   * Override this for individual apps.
   */
  setApplicationListeners() {}
}
