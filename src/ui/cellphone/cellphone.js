import Animations from "../animations.js";
import UIElement from "../ui-elements/ui-element.js";
import CameraApp from "./camera-app.js";

export default class Cellphone extends UIElement {
  constructor(options) {
    super(options);
    this.name = "cellphone";
    this.spriteData = getSprite("cellphone"); // Should this be defined in UIElement instead?

    const { initial } = this;
    initial.offset = vec2(1100, 1000);
    this.final.offset = vec2(1100, 500);

    initial.opacity = 0.8;
    this.final.opacity = 1;

    this.movementVector = vec2(0, 0);
    this.speed = 300;

    // This will be a child of the cellphone object, and parent
    // to app icons and other screen elements.
    this.screenSpace = null;

    this.apps = {
      current: "none",
      camera: new CameraApp(),
    };
  }

  initialize(parentObject) {
    super.initialize(parentObject);

    // Generate screenspace componenet
    this.screenSpace = this.gameObj.add([
      area({ shape: new Rect(vec2(0, 0), 245, 386) }),
      pos(-110, -200),
      "screenspace",
      { name: "screenspace" },
    ]);

    // Initialize all app icons.
    const apps = Object.values(this.apps).filter((a) => typeof a !== "string");
    for (const app of apps) {
      // Apps are a child of the screenspace.
      app.initialize(this.screenSpace);
    }
  }

  getComponents() {
    const parentComponents = super.getComponents();
    return [
      ...parentComponents,
      sprite("cellphone"),
      rotate(),
      area(),
      anchor("center"),
      fixed(),
      offscreen(),
    ];
  }

  startApp(appName) {
    if (!this.gameObj) return;
    Object.values(this.listeners)
      .flat()
      .forEach((l) => {
        l.paused = true;
      });
    this.apps[appName].start();
    this.apps.current = appName;
  }

  async closeApp(appName) {
    if (!this.gameObj) return;
    await this.apps[appName].close();
    Object.values(this.listeners)
      .flat()
      .forEach((l) => {
        l.paused = false;
      });
    this.apps.current = "none";
  }

  /**
   * Set the listener for opening/closing (initializing/destroying)
   * the cellphone game object.
   *
   * @param {GameObj} parentObject
   */
  setPhoneListeners(parentObject) {
    this.listeners.openPhone = onKeyPress("c", () => {
      if (this.gameObj) {
        this.destroy();
        return;
      }
      this.initialize(parentObject);
      this.setFadeOnHover({ excludedNames: ["screenspace"] });
    });
  }

  /**
   * Slide Up From Bottom
   * @override
   */
  playOpenAnimation() {
    Animations.SlideVertical(
      this.gameObj,
      this.initial.offset.y,
      this.final.offset.y,
      0.5,
    );
  }

  /**
   * Slide Down From Top
   * @override
   */
  async playCloseAnimation() {
    await Animations.SlideVertical(
      this.gameObj,
      this.gameObj.pos.y,
      this.initial.offset.y,
      0.5,
    );
  }
}
