import Application from "./application.js";
import Animations from "../animations.js";
import KeyUtils from "../../utils/keys.js";

export default class CameraApp extends Application {
  constructor() {
    super();
    this.name = "camera";
  }

  /**
   * Slide to the center and become (more) transparent.
   * @returns {Promise}
   */
  startAnimation() {
    const { Cellphone } = StuckGame;
    const animations = [
      Animations.Fade(Cellphone.gameObj, Cellphone.gameObj.opacity, 0.5, 2),
      Animations.Slide(Cellphone.gameObj, Cellphone.gameObj.pos, center(), 2),
    ];
    return Promise.all(animations);
  }

  /**
   * Slide back to open position and become (less) transparent.
   * @returns {Promise}
   */
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

  /**
   * This is a rudimentary start to a phone being able to take pictures,
   * but a lot needs to change for it to work properly/consistently. Namely,
   * we have to figure out how to take the picture based on the position of the camera.
   */
  setApplicationListeners() {
    const { Cellphone } = StuckGame;

    this.setPhoneCameraMovement(); // Allow camera to be moved by user.

    // Rotate the phone 90 degrees and back.
    const rotatePhone = onKeyPress("r", () => {
      if (Cellphone.gameObj.angle === 0) {
        Cellphone.gameObj.rotateTo(90);
        return;
      }
      Cellphone.gameObj.rotateTo(0);
    });
    this.listeners.push(rotatePhone);

    // Take a screenshot, crop, and download.
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

      /**
       * @param {*GameObj} gameObj
       * @param {String} uri - base64 encoded image uri
       * @param {String} name - name of exported image
       */
      async function downloadURI(gameObj, uri, name) {
        const image = new Image();

        // We have to make sure the actual image source is loaded before drawing and
        // exporting a (potentially) blank image. We make sure `onload` resolves the
        // promise where we set the src.
        await new Promise((resolve) => {
          image.onload = resolve;
          image.src = uri;
        });

        // Create a canvas element so we can draw an image on it, and then export it.
        const canvas = document.createElement("canvas");
        canvas.width = 315;
        canvas.height = 523;
        const context = canvas.getContext("2d");
        context.drawImage(
          image, // Image source
          gameObj.screenPos().x - 125, // X Offset of source
          gameObj.screenPos().y - 150, // Y Offset of source
          315, // Width of source
          523, // Height of source
          0, // X Offset of image on destination canvas
          0, // Y Offest of same
          canvas.width, // Width of destination
          canvas.height, // Height of destination
        );
        // Convert our canvas into a data url.
        const croppedURL = canvas.toDataURL();

        // Make a link from which the image can be downloaded.
        const link = document.createElement("a");
        link.download = name;
        link.href = croppedURL;
        document.body.appendChild(link);
        link.click(); // Force click.
        document.body.removeChild(link);
      }
      downloadURI(Cellphone.gameObj, photo, "helloWorld.png");
    });

    this.listeners.push(_screenshot);
  }

  setPhoneCameraMovement() {
    const { Cellphone } = StuckGame;
    const movement = onUpdate(() => {
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
