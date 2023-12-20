import Animations from "../../animations.js";
import GameElement from "../../game-element.js";

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
    const appOpenListener = this.gameObj.onClick(() => {
      const app = this.name;
      if (StuckGame.Cellphone.apps.current === app) return;
      StuckGame.Cellphone.startApp(app);
    });
    StuckGame.Cellphone.listeners.appIcons.push(appOpenListener);
  }

  getComponents() {
    const parentComponents = super.getComponents();
    return [
      ...parentComponents,
      sprite(this.spriteName, { width: 60, height: 60 }),
      area(),
      "appIcon",
    ];
  }

  /**
   * Start the app and create associated listeners.
   */
  async start() {
    await this.startAnimation();
    StuckGame.Cellphone.listeners.homeButton.paused = false; // Resume homeButton listener once app is opened.
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
   * Override/super this for individual apps.
   * Fade all app icons out.
   */
  startAnimation() {
    const { Cellphone } = StuckGame;
    const appIcons = Cellphone.gameObj.get("appIcon", { recursive: true });
    const animations = [];
    for (const icon of appIcons) {
      animations.push(Animations.Fade(icon, icon.opacity, 0, 0.3));
    }
    return Promise.all(animations);
  }

  /**
   * Override/super this for individual apps.
   * Fall all app icons back in.
   */
  closeAnimation() {
    const { Cellphone } = StuckGame;
    const appIcons = Cellphone.gameObj.get("appIcon", { recursive: true });
    const animations = [];
    for (const icon of appIcons) {
      animations.push(Animations.Fade(icon, 0, 1, 0.3));
    }
    return Promise.all(animations);
  }

  /**
   * Override this for individual apps.
   */
  setApplicationListeners() {}
}
