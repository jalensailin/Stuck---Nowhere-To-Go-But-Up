import Animations from "../../animations.js";
import Application from "./application.js";

export default class SnakeApp extends Application {
  constructor() {
    super("snake", "snake-icon");
    this.initial.offset = vec2(166, 34);

    this.gameSpace = null;
    this.innerWindow = null;
    this.snakeHead = null;

    this.dir = DOWN;

    this.gameOver = true;
    this.score = 0;
    this.highScore = 0;
  }

  async start() {
    this.initializeGameSpace();
    await super.start();
  }

  async close() {
    await super.close();
    this.gameSpace.destroy();
    this.gameSpace = null;
    this.innerWindow = null;
    this.snakeHead = null;
    this.resetStates();
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
    this.listeners.push(
      onKeyPress("enter", () => {
        this.startSnakeGame();
      }),
    );
  }

  setSnakeListeners() {
    // Set the movement controls
    this.setSnakeMovement();

    // Game Over if we collide with our own body.
    this.snakeHead.onCollide("snakeBody", () => {
      this.snakeGameOver();
    });

    // Game Over if we collide with the boundary.
    this.snakeHead.onCollideUpdate("snakeBoundary", (_, collision) => {
      if (!collision.displacement.isZero()) return;
      this.snakeGameOver();
    });

    // Destroy Apple and increase score.
    this.snakeHead.onCollide("apple", (apple) => {
      apple.destroy();

      // Increase score.
      this.score += apple.points;
      // Set high score if applicable.

      // Get body parts and identify the most distal (the caboose).
      if (this.score > this.highScore) this.highScore = this.score;
      const bodyParts = this.innerWindow.get("snakeBody", { recursive: true });
      const caboose = bodyParts.at(-1);
      // Create a new body part at the position of the caboose.
      this.createSnakeBodyPart(caboose.pos);
      // Generate an apple in a random position.
      this.generateApple();
    });
  }

  /**
   * Set the movement controls for the snake.
   */
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
    this.listeners.push(...movementControls);
  }

  /**
   * Initialize the space that the game takes place in.
   */
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

    // Add boundary line. Also acts as a collider.
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

  /**
   * Initialize the snake at the beginning of each round.
   */
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
   * Create an individual body part.
   * @param {vec2} pos
   */
  createSnakeBodyPart(position) {
    this.innerWindow.add([
      pos(position),
      rect(10, 10),
      outline(2, rgb(150, 150, 150)),
      color(0, 0, 0),
      opacity(),
      timer(),
      area({ shape: new Rect(vec2(1, 1), 8, 8) }),
      "snakeBody",
    ]);
  }

  /**
   * Generate the apple.
   */
  generateApple() {
    const { innerWindow } = this;
    const bodyParts = this.gameSpace.get("snakeBody", { recursive: true });

    // Assign the apple a random position on the grid.
    let applePosition = vec2(randi(22) * 10, randi(22) * 10);

    // If the position intersects with the position of the snake, find a new random position.
    // eslint-disable-next-line no-loop-func
    while (bodyParts.some((part) => part.pos.eq(applePosition))) {
      applePosition = vec2(randi(22) * 10, randi(22) * 10);
    }

    const points = randi(20) === 0 ? 10 : 1;
    const fillColor = points === 10 ? rgb(255, 215, 0) : rgb(196, 41, 41);
    const outlineColor = points === 10 ? rgb(110, 99, 4) : rgb(4, 110, 55);

    // Add the apple.
    innerWindow.add([
      pos(applePosition),
      rect(10, 10, { radius: 2 }),
      color(fillColor),
      outline(2, outlineColor),
      opacity(),
      timer(),
      area(),
      { points },
      "apple",
    ]);
  }

  /**
   * Create an instance of the game itself, and set associated listeners.
   * @returns {void}
   */
  startSnakeGame() {
    // Early return if we are not in a game-over state.
    if (!this.gameOver) return;

    // Destroy any existing apples.
    const [existingApple] = this.innerWindow.get("apple");
    if (existingApple) existingApple.destroy();

    // Initialize the snake and generate the apples.
    this.initializeSnake();
    this.generateApple();

    // Set all listeners for playing Snake.
    this.setSnakeListeners();

    const { snakeHead, innerWindow } = this;
    this.gameOver = false; // Game-in-progress

    // The main Snake gameplay loop.
    snakeHead.loop(0.2, () => {
      const bodyParts = innerWindow.get("snakeBody", { recursive: true });
      // Map body parts to their next location.
      const nextPositions = bodyParts.map((part, index) => {
        const nextPosition =
          index === 0
            ? snakeHead.pos.clone()
            : bodyParts[index - 1].pos.clone();
        return nextPosition;
      });
      // Move body parts to next location.
      bodyParts.forEach((part, index) => {
        part.pos = nextPositions[index];
      });
      if (snakeHead.lastDir.eq(this.dir.scale(-1))) return;
      // Move head to next location.
      snakeHead.pos = snakeHead.pos.add(this.dir.scale(10));
      // Update previous direction
      snakeHead.lastDir = this.dir;
    });
  }

  /**
   * Handle game over actions. Destroy Snake and reset properties.
   */
  snakeGameOver() {
    this.snakeHead.destroy();
    const bodyParts = this.innerWindow.get("snakeBody", { recursive: true });
    bodyParts.forEach((part) => part.destroy());
    this.resetStates();
  }

  /**
   * Reset basic states of this app for game-over and closing.
   */
  resetStates() {
    this.dir = DOWN;
    this.score = 0;
    this.gameOver = true;
  }
}
