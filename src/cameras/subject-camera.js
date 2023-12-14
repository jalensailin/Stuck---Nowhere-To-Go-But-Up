import Animations from "../elements/animations.js";
import Camera from "./camera.js";

export default class SubjectCamera extends Camera {
  constructor(subject, { scale = 1, rotation = 0 } = {}) {
    super({ scale, rotation });
    this.subject = subject;
    this.follow = true;
  }

  initialize() {
    super.initialize();
    this.followSubject();
  }

  followSubject() {
    // Update loop that is run every frame.
    onUpdate(() => {
      if (!this.follow) return;
      // TODO: figure out what this conditional is doing
      if (this.subject.gameObj.pos.dist(camPos())) {
        // If we want the tween to finish before moving on with logic, use `await`
        Animations.CameraFollow(this.subject.gameObj, 0.05);
      }
    });
  }
}
