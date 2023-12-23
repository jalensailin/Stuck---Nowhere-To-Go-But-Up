import Animations from "../../animations.js";
import Application from "./application.js";

export default class SnakeApp extends Application {
  constructor() {
    super("snake", "snake-icon");
    this.initial.offset = vec2(166, 34);

    this.gameSpace = null;

    this.dir = DOWN;
  }

  async start() {
    const { Cellphone } = StuckGame;
    // Game Space defines the area on the screen that our game takes up.
    this.gameSpace = Cellphone.screenSpace.add([
      pos(0, Cellphone.infoBar.height),
    ]);

    const outerWindow = this.gameSpace.add([
      pos(0, 0),
      rect(Cellphone.screenSpace.width, Cellphone.screenSpace.width),
      color(130, 130, 130),
      opacity(),
      timer(),
    ]);

    const boundary = outerWindow.add([
      pos(9.5, 9.5),
      rect(outerWindow.width - 19, outerWindow.height - 19, { fill: false }),
      outline(2, rgb(0, 0, 0)),
      opacity(),
      timer(),
    ]);

    const innerWindow = outerWindow.add([
      pos(10.5, 10.5),
      rect(boundary.width - 2, boundary.height - 2),
      color(100, 100, 100),
      opacity(),
      timer(),
    ]);

    const apple = innerWindow.add([
      pos(randi(22) * 10, randi(22) * 10),
      rect(10, 10, { radius: 2 }),
      opacity(),
      timer(),
      area(),
      body(),
      "apple",
    ]);

    const snakeHead = innerWindow.add([
      pos(100, 100),
      rect(10, 10),
      outline(2, rgb(150, 150, 150)),
      color(0, 0, 0),
      opacity(),
      timer(),
      area(),
      body(),
      "snakeHead",
    ]);

    const snakeBody = innerWindow.add([
      pos(0, 0),
      rect(10, 10),
      outline(2, rgb(150, 150, 150)),
      color(0, 0, 0),
      opacity(),
      timer(),
      area(),
      follow(snakeHead, vec2(0, 10)),
      "snakeBody",
    ]);

    onKeyPress("enter", () => {
      snakeHead.loop(0.5, () => {
        snakeHead.pos = snakeHead.pos.add(this.dir.scale(10));
      });

      const movementControls = [
        onKeyPress("i", () => {
          if (this.dir !== DOWN) this.dir = UP;
        }),
        onKeyPress("k", () => {
          if (this.dir !== UP) this.dir = DOWN;
        }),
        onKeyPress("j", () => {
          if (this.dir !== RIGHT) this.dir = LEFT;
        }),
        onKeyPress("l", () => {
          if (this.dir !== LEFT) this.dir = RIGHT;
        }),
      ];
    });

    await super.start();
  }

  async close() {
    await super.close();
    this.gameSpace.destroy();
    this.gameSpace = null;
  }

  /**
   * Fade gameSpace in.
   * @override
   */
  startAnimation() {
    super.startAnimation();
    return Animations.FadeChildren(this.gameSpace, 0, 1, 0.3);
  }

  /**
   * Fade gameSpace out.
   * @override
   */
  async closeAnimation() {
    await Animations.FadeChildren(this.gameSpace, 1, 0, 0.3);
    return super.closeAnimation();
  }
}
