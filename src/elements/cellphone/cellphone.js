import Animations from "../animations.js";
import GameElement from "../game-element.js";
import CameraApp from "./applications/camera-app.js";
import MessagesApp from "./applications/messages-app.js";

export default class Cellphone extends GameElement {
  constructor(options) {
    super("cellphone", "cellphone", options);

    const { initial } = this;
    initial.offset = vec2(1100, 1000);
    this.final.offset = vec2(1100, 475);

    initial.opacity = 0.8;
    this.final.opacity = 1;

    // Needed for the camera-app.
    this.movementVector = vec2(0, 0);
    this.speed = 300;

    // This will be a child of the cellphone object, and parent
    // to app icons and other screen elements.
    this.screenSpace = null;
    this.infoBar = null;
    this.homeButton = null;

    this.apps = {
      current: "none",
      camera: new CameraApp(),
      messages: new MessagesApp(),
    };

    this.listeners.appIcons = [];
  }

  initialize(parentObject) {
    super.initialize(parentObject);

    // /////////////////////////////// //
    /* Generate phone child components */
    // /////////////////////////////// //
    // Generate Screenspace area.
    this.screenSpace = this.gameObj.add([
      pos(-111, -202),
      rect(241, 397),
      mask(),
      area(),
      "screenspace",
      { name: "screenspace" },
    ]);

    // Generate the info bar.
    this.generateInfoBar();

    // Generate Home Button area.
    this.homeButton = this.gameObj.add([
      sprite("home-button", {
        width: 104,
        height: 104,
        frame: 0,
        animSpeed: 1.8,
      }), // Same scale as
      area({ shape: new Rect(vec2(0, -7), 60, 33) }),
      pos(-19.5, 215),
      opacity(0.8),
      timer(),
      "homeButton",
      { name: "homeButton" },
      { initialOpacity: 0.8, finalOpacity: 1 },
    ]);

    // Initialize all app icons.
    const apps = Object.values(this.apps).filter((a) => typeof a !== "string");
    for (const app of apps) {
      // Apps are a child of the screenspace.
      app.initialize(this.screenSpace);
    }
  }

  /**
   * Add info bar to phone (date, time, cellular network).
   */
  generateInfoBar() {
    // Generate info bar.
    this.infoBar = this.screenSpace.add([
      pos(0),
      rect(this.screenSpace.width, 20),
      color(167, 209, 177),
      opacity(0.4),
      { initialOpacity: 0.4, finalOpacity: 1 },
      timer(),
      "infoBar",
      { name: "infoBar" },
    ]);
    this.infoBar.add([
      text("soulSellular", { size: 12 }),
      pos(2, 5),
      color(0, 0, 0),
      opacity(0.4),
      { initialOpacity: 0.4, finalOpacity: 1 },
      timer(),
      "cellCarrier",
      { name: "cellCarrier" },
    ]);
    this.infoBar.add([
      text("4:20", { size: 12, width: 30 }),
      pos(110, 5),
      color(0, 0, 0),
      opacity(0.4),
      { initialOpacity: 0.4, finalOpacity: 1 },
      timer(),
      "currentTime",
      { name: "currentTime" },
    ]);
    this.infoBar.add([
      text("69%", { size: 12, width: 24 }),
      pos(216, 5),
      color(0, 0, 0),
      opacity(0.4),
      { initialOpacity: 0.4, finalOpacity: 1 },
      timer(),
      "batteryPercentage",
      { name: "batteryPercentage" },
    ]);
  }

  getComponents() {
    const parentComponents = super.getComponents();
    return [
      ...parentComponents,
      sprite(this.spriteName, { width: 312, height: 520 }), // 0.65 scale
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
      this.setFadeOnHover({
        excludedNames: ["screenspace"],
      });
    });

    this.listeners.homeButton = onClick("homeButton", () => {
      this.homeButton.play("depress");
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
