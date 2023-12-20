import Animations from "../../animations.js";
import Application from "./application.js";

export default class MessagesApp extends Application {
  constructor() {
    super("messages", "messages-icon");
    this.initial.offset = vec2(90, 34);

    this.currentChat = "friend1";
    this.messageMask = null;
    this.messageSpace = null;
    this.chats = {
      friend1: [
        { message: "This is a Test", contact: true },
        { message: "This is another Test2", contact: false },
        { message: "This is another Test3", contact: false },
        { message: "This is another Test4", contact: true },
        { message: "This is another Test5", contact: false },
        { message: "This is another Test6", contact: true },
        { message: "This is another Test7", contact: true },
        { message: "This is a Test", contact: true },
        { message: "This is a Test", contact: true },
      ],
    };
  }

  /**
   * Generate the game objects for a particular group of messages.
   */
  generateMessages() {
    if (this.currentChat === "none") return;
    const { Cellphone } = StuckGame;
    // Message mask defines the area on the screen that our messages takes up.
    this.messageMask = Cellphone.screenSpace.add([
      pos(0, Cellphone.infoBar.height), // Position bottom left corner of info bar.
      // Fill the screen under the info bar
      rect(
        Cellphone.screenSpace.width,
        Cellphone.screenSpace.height - Cellphone.infoBar.height,
      ),
      mask(), // Only render within this rectangle.
      "messageMask",
      { name: "messageMask" },
    ]);

    // messageSpace contains each chat message and moves up/down on scroll.
    this.messageSpace = this.messageMask.add([
      pos(0, Cellphone.screenSpace.height - Cellphone.infoBar.height),
      "messageSpace",
      { name: "messageSpace" },
    ]);

    const messageList = this.chats[this.currentChat].toReversed();
    messageList.forEach((message, index) => {
      const msgColor = message.contact ? rgb(117, 217, 50) : rgb(74, 160, 217);
      const positionX = message.contact ? 15 : 75;
      const positionY = -75 - index * 70; // 10 pixel gap between messages.
      const msg = this.messageSpace.add([
        pos(positionX, positionY),
        rect(150, 60, { radius: 10 }),
        color(msgColor),
        opacity(0),
        timer(),
        "messageBubble",
        { name: "messageBubble" },
      ]);
      msg.add([
        pos(5, 5),
        text(message.message, {
          size: 12,
          width: message.width - 5,
        }),
        color(0, 0, 0),
        opacity(0),
        timer(),
        "messageText",
        { name: "messageText" },
      ]);
    });
  }

  /**
   * Generate game objects for the messages.
   * @override
   */
  async start() {
    this.generateMessages();
    await super.start();
  }

  /**
   * Generate game objects for the messages.
   * @override
   */
  async close() {
    await super.close();
    this.messageMask.destroy();
    this.messageSpace.destroy();
    this.messageMask = null;
    this.messageSpace = null;
  }

  /**
   * Fade messages in.
   * @override
   */
  startAnimation() {
    super.startAnimation();
    return Animations.FadeChildren(this.messageSpace, 0, 1, 0.3);
  }

  /**
   * Fade messages out.
   * @override
   */
  async closeAnimation() {
    await Animations.FadeChildren(this.messageSpace, 1, 0, 0.3);
    return super.closeAnimation();
  }

  /**
   * Set scroll behavior and other listeners.
   * @override
   */
  setApplicationListeners() {
    const messageList = this.chats[this.currentChat].toReversed();
    const messagesHeight = messageList.length * 72; // TODO: Dynamically calculate height.
    const scrollListener = this.messageSpace.onScroll((vector) => {
      if (
        vector.y > 0 &&
        messagesHeight - (this.messageSpace.pos.y - this.messageMask.height) <=
          this.messageMask.height
      )
        return;
      if (vector.y < 0 && this.messageSpace.pos.y <= this.messageMask.height)
        return; // Don't scroll below most recent message.
      this.messageSpace.pos.y += vector.y;
    });
    this.listeners.push(scrollListener);
  }
}
