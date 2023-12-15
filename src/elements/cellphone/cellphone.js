import Animations from "../animations.js";
import GameElement from "../game-element.js";
import CameraApp from "./camera-app.js";

export default class Cellphone extends GameElement {
  constructor(options) {
    super("cellphone", "cellphone", options);
    // this.spriteData = getSprite("cellphone"); // Should this be defined in GameElement instead?

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
    this.homeButton = null;

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
    this.homeButton = this.gameObj.add([
      area({ shape: new Rect(vec2(0, 0), 45, 45) }),
      pos(-10, 200),
      "homeButton",
      { name: "homeButton" },
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
      this.setFadeOnHover({ excludedNames: ["screenspace", "homeButton"] });
    });

    onClick("homeButton", () => {
      if (this.apps.current === "none") return;
      this.closeApp(this.apps.current);
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
