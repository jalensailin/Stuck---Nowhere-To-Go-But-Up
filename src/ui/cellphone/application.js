import KeyUtils from "../../utils/keys.js";
import Animations from "../animations.js";

export default class Application {
  constructor(name) {
    this.name = name;
    this.listeners = [];
  }

  async start() {
    await this.startAnimation();
    this.setApplicationListeners();
  }

  async close() {
    await this.closeAnimation();
    this.listeners.forEach((listener) => listener.cancel());
  }

  startAnimation() {
    const { Cellphone } = StuckGame;
    const animations = [
      Animations.Fade(Cellphone.gameObj, Cellphone.gameObj.opacity, 0.5, 2),
      Animations.Slide(Cellphone.gameObj, Cellphone.gameObj.pos, center(), 2),
    ];
    return Promise.all(animations);
  }

  closeAnimation() {
    const { Cellphone } = StuckGame;
    const animations = [
      Animations.Fade(
        Cellphone.gameObj,
        Cellphone.gameObj.opacity,
        Cellphone.initial.opacity,
        2,
      ),
      Animations.Slide(
        Cellphone.gameObj,
        Cellphone.gameObj.pos,
        vec2(Cellphone.final.offset), // Wrap this in vec2 so that we don't change the actual value of `Cellphone.final.offset`. This may be a bug.
        2,
      ),
    ];
    return Promise.all(animations);
  }

  setApplicationListeners() {
    const { Cellphone } = StuckGame;
    this.setPhoneCameraMovement();
    const rotatePhone = onKeyPress("r", () => {
      if (!isKeyDown("shift")) return;
      if (Cellphone.gameObj.angle === 0) {
        Cellphone.gameObj.rotateTo(90);
        return;
      }
      Cellphone.gameObj.rotateTo(0);
    });
    this.listeners.push(rotatePhone);

    const _screenshot = onKeyPress("p", async () => {
      const photo = screenshot();
      await loadSpriteAtlas(photo, {
        fol: {
          x: Cellphone.gameObj.screenPos().x - 125,
          y: Cellphone.gameObj.screenPos().y - 380,
          width: 300,
          height: 730,
        },
      });
      add([
        sprite("fol"),
        pos(200, 30),
        scale(0.2),
        outline(RED),
        lifespan(1, { fade: 0.5 }),
      ]);
      async function downloadURI(gameObj, uri, name) {
        const image = new Image();
        await new Promise((resolve) => {
          image.onload = resolve;
          image.src = uri;
        });
        const canvas = document.createElement("canvas");
        canvas.width = 315;
        canvas.height = 523;
        const context = canvas.getContext("2d");
        context.drawImage(
          image,
          gameObj.screenPos().x - 125,
          gameObj.screenPos().y - 150,
          315,
          523,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const croppedURL = canvas.toDataURL();

        // Make a link from which the image can be downloaded.
        const link = document.createElement("a");
        link.download = name;
        link.href = croppedURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      downloadURI(Cellphone.gameObj, photo, "helloWorld.png");
    });

    this.listeners.push(_screenshot);
  }

  setPhoneCameraMovement() {
    const { Cellphone } = StuckGame;
    const movement = onUpdate(() => {
      if (!isKeyDown("shift")) return;
      const vel = {
        x: 0,
        y: 0,
      };
      // Check if keys are down and assign velocity components accordingly.
      if (KeyUtils.areKeysDown(["i"])) {
        vel.y -= 1;
      }
      if (KeyUtils.areKeysDown(["k"])) {
        vel.y += 1;
      }
      if (KeyUtils.areKeysDown(["l"])) {
        vel.x += 1;
      }
      if (KeyUtils.areKeysDown(["j"])) {
        vel.x -= 1;
      }
      Cellphone.directionVector = vec2(vel.x, vel.y);
      if (!Cellphone.directionVector.isZero()) {
        const velocity = Cellphone.directionVector
          .unit()
          .scale(Cellphone.speed); // unit() to fix diagonal movement
        Cellphone.gameObj.move(velocity);
      }
      this.listeners.push(movement);
    });
  }
}
