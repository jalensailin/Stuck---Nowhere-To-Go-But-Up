import Animations from "../../animations.js";
import Application from "./application.js";

export default class SnakeApp extends Application {
  constructor() {
    super("snake", "snake-icon");
    this.initial.offset = vec2(166, 34);

    this.gameSpace = null;
    this.innerWindow = null;
    this.snakeHead = null;
    this.gameOver = true;

    this.dir = DOWN;
  }

  async start() {
    this.initializeGameSpace();
    this.initializeSnake();
    this.generateApple();

    await super.start();
  }

  async close() {
    await super.close();
    this.gameSpace.destroy();
    this.gameSpace = null;
    this.innerWindow = null;
    this.snakeHead = null;
    this.gameOver = true;
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

  setApplicationListeners() {
    const [snakeHead] = this.gameSpace.get("snakeHead", { recursive: true });
    const [innerWindow] = this.gameSpace.get("innerWindow", {
      recursive: true,
    });
    onKeyPress("enter", () => {
      this.startSnakeGame();
    });

    this.setSnakeMovement();

    snakeHead.onCollide("snakeBody", () => {
      snakeHead.destroy();
      const bodyParts = innerWindow.get("snakeBody", { recursive: true });
      bodyParts.forEach((part) => part.destroy());
      this.dir = DOWN;
      this.gameOver = true;
    });

    snakeHead.onCollideUpdate("snakeBoundary", (_, collision) => {
      if (!collision.displacement.isZero()) return;
      snakeHead.destroy();
      const bodyParts = innerWindow.get("snakeBody", { recursive: true });
      bodyParts.forEach((part) => part.destroy());
      this.dir = DOWN;
      this.gameOver = true;
    });

    snakeHead.onCollide("apple", (apple) => {
      apple.destroy();
      const bodyParts = innerWindow.get("snakeBody", { recursive: true });
      const caboose = bodyParts.at(-1);
      this.createSnakeBodyPart(caboose.pos, caboose.lastDir);
      this.generateApple();
    });
  }

  setSnakeMovement() {
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
  }

  initializeGameSpace() {
    const { Cellphone } = StuckGame;
    // Game Space defines the area on the screen that our game takes up.
    this.gameSpace = Cellphone.screenSpace.add([
      pos(0, Cellphone.infoBar.height),
    ]);

    // Add border
    const outerWindow = this.gameSpace.add([
      pos(0, 0),
      rect(Cellphone.screenSpace.width, Cellphone.screenSpace.width),
      color(130, 130, 130),
      opacity(),
      timer(),
    ]);

    // Add boundary line.
    const boundary = outerWindow.add([
      pos(9.5, 9.5),
      rect(outerWindow.width - 19, outerWindow.height - 19, { fill: false }),
      outline(2, rgb(0, 0, 0)),
      area(),
      opacity(),
      timer(),
      "snakeBoundary",
    ]);

    // Add inner window
    this.innerWindow = outerWindow.add([
      pos(10.5, 10.5),
      rect(boundary.width - 2, boundary.height - 2),
      color(100, 100, 100),
      opacity(),
      timer(),
      "innerWindow",
    ]);
  }

  initializeSnake() {
    this.snakeHead = this.innerWindow.add([
      pos(100, 100),
      rect(10, 10),
      outline(2, rgb(150, 150, 150)),
      color(0, 0, 0),
      opacity(),
      timer(),
      area({ shape: new Rect(vec2(1, 1), 8, 8) }),
      body(),
      "snakeHead",
      { lastDir: DOWN },
    ]);

    for (let i = 1; i <= 3; i++) {
      this.createSnakeBodyPart(
        vec2(this.snakeHead.pos.x, this.snakeHead.pos.y - i * 10),
      );
    }
  }

  /**
   *
   * @param {vec2} pos
   */
  createSnakeBodyPart(position, direction = DOWN) {
    this.innerWindow.add([
      pos(position),
      rect(10, 10),
      outline(2, rgb(150, 150, 150)),
      color(0, 0, 0),
      opacity(),
      timer(),
      area({ shape: new Rect(vec2(1, 1), 8, 8) }),
      "snakeBody",
      { lastDir: direction },
    ]);
  }

  generateApple() {
    const { innerWindow } = this;
    const bodyParts = this.gameSpace.get("snakeBody", { recursive: true });

    let applePosition = vec2(randi(22) * 10, randi(22) * 10);
    // eslint-disable-next-line no-loop-func
    while (bodyParts.some((part) => part.pos.eq(applePosition))) {
      applePosition = vec2(randi(22) * 10, randi(22) * 10);
    }

    innerWindow.add([
      pos(applePosition),
      rect(10, 10, { radius: 2 }),
      opacity(),
      timer(),
      area(),
      "apple",
    ]);
  }

  startSnakeGame() {
    if (!this.gameOver) return;
    const { snakeHead, innerWindow } = this;
    this.gameOver = false;
    snakeHead.loop(0.2, () => {
      const bodyParts = innerWindow.get("snakeBody", { recursive: true });
      const bodyData = bodyParts.map((part, index) => {
        const position =
          index === 0
            ? snakeHead.pos.clone()
            : bodyParts[index - 1].pos.clone();
        return {
          position,
        };
      });
      bodyParts.forEach((part, index) => {
        part.pos = bodyData[index].position;
      });
      if (snakeHead.lastDir.eq(this.dir.scale(-1))) return;
      snakeHead.pos = snakeHead.pos.add(this.dir.scale(10));
      snakeHead.lastDir = this.dir;
    });
  }
}
