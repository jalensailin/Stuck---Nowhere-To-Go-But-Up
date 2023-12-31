import Application from "./application.js";
import Animations from "../../animations.js";
import MovementUtils from "../../../utils/movement.js";
import STUCK from "../../../config.js";

export default class CameraApp extends Application {
  constructor() {
    super("camera", "camera-icon");
    this.initial.offset = vec2(14, 34);
  }

  /**
   * Slide to the center and become (more) transparent.
   * @returns {Promise}
   */
  startAnimation() {
    const { Cellphone } = StuckGame;
    super.startAnimation();
    const animations = [
      // Fade the whole cellphone.
      Animations.Fade(Cellphone.gameObj, Cellphone.gameObj.opacity, 0.5, 2),
      // Slide this whole cellphone.
      Animations.Slide(Cellphone.gameObj, Cellphone.gameObj.pos, center(), 2),
    ];
    return Promise.all(animations);
  }

  /**
   * Slide back to open position and become (less) transparent.
   * @returns {Promise}
   */
  async closeAnimation() {
    const { Cellphone } = StuckGame;
    const animations = [
      // Fade the whole cellphone.
      Animations.Fade(
        Cellphone.gameObj,
        Cellphone.gameObj.opacity,
        Cellphone.initial.opacity,
        2,
      ),
      // Slide this whole cellphone.
      Animations.Slide(
        Cellphone.gameObj,
        Cellphone.gameObj.pos,
        vec2(Cellphone.final.offset), // Wrap this in vec2 so that we don't change the actual value of `Cellphone.final.offset`. This may be a bug.
        2,
      ),
      Animations.Rotate(Cellphone.gameObj, Cellphone.gameObj.angle, 0, 2),
    ];
    await Promise.all(animations);
    return super.closeAnimation();
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
    const screenshotListener = onKeyPress("p", async () => {
      const cellphoneChildrenObjects = Cellphone.gameObj
        .get("*", { recursive: true })
        .filter((obj) => obj.opacity)
        .concat(Cellphone.gameObj);
      //
      const prevOpacities = cellphoneChildrenObjects.map((obj) => obj.opacity);
      // Make phone and child objects transparent for the screenshot.
      cellphoneChildrenObjects.forEach((obj) => {
        obj.opacity = 0;
      });
      // Wait a fraction of a second before taking the screenshot so that things are actually transparent.
      await wait(0.05);
      const photo = screenshot();
      // Add a flash effect
      add([rect(10000, 10000), opacity(), lifespan(0.1, 0.1)]);
      // Restore phone and child objects back to previous opacity
      cellphoneChildrenObjects.forEach((obj, index) => {
        obj.opacity = prevOpacities[index];
      });
      const canvasWidthActual = canvas.width;
      const canvasHeightActual = canvas.height;
      const canvasWidthOriginal = StuckGame.Canvas.width;
      const canvasHeightOriginal = StuckGame.Canvas.height;

      const ratio = {
        x: canvasWidthActual / canvasWidthOriginal,
        y: canvasHeightActual / canvasHeightOriginal,
      };

      const bbx = Cellphone.screenSpace.screenArea().bbox();
      const screenshotData = {
        offsetX: bbx.pos.x * ratio.x,
        offsetY: bbx.pos.y * ratio.y,
        width: bbx.width * ratio.x,
        height: bbx.height * ratio.y,
      };

      await loadSpriteAtlas(photo, {
        screenshot: {
          x: screenshotData.offsetX,
          y: screenshotData.offsetY,
          width: screenshotData.width,
          height: screenshotData.height,
        },
      });
      StuckGame.Cellphone.gameObj.add([
        sprite("screenshot"),
        pos(-16, 0),
        scale(0.3),
        opacity(),
        lifespan(1, { fade: 0.5 }),
      ]);

      const image = new Image();

      // We have to make sure the actual image source is loaded before drawing and
      // exporting a (potentially) blank image. We make sure `onload` resolves the
      // promise where we set the src.
      await new Promise((resolve) => {
        image.onload = resolve;
        image.src = photo;
      });

      // Create a canvas element so we can draw an image on it, and then export it.
      const newCanvas = document.createElement("canvas");
      newCanvas.width = screenshotData.width;
      newCanvas.height = screenshotData.height;
      const context = newCanvas.getContext("2d");

      context.drawImage(
        image, // Image source
        screenshotData.offsetX, // X Offset of source
        screenshotData.offsetY, // Y Offset of source
        screenshotData.width, // Width of source
        screenshotData.height, // Height of source
        0, // X Offset of image on destination newCanvas
        0, // Y Offest of same
        screenshotData.width, // Width of destination
        screenshotData.height, // Height of destination
      );
      // Convert our newCanvas into a data url.
      const croppedURL = newCanvas.toDataURL();

      // Make a link from which the image can be downloaded.
      const link = document.createElement("a");
      link.download = "helloWorld.png";
      link.href = croppedURL;
      document.body.appendChild(link);
      link.click(); // Force click.
      document.body.removeChild(link);
    });

    this.listeners.push(screenshotListener);
  }

  setPhoneCameraMovement() {
    const { Cellphone } = StuckGame;
    const movement = MovementUtils.fourWayMovement(
      Cellphone,
      STUCK.controls.cameraApp,
    );
    this.listeners.push(movement);
  }
}
