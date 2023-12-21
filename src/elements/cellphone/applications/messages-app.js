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
        {
          message: "Hey! Long time no talk. I miss uuu. How have things been?",
          contact: true,
        },
        {
          message: "Hey that's sweet of you to reach out. i miss you too",
          contact: false,
        },
        { message: "Things are okay with me. What about you?", contact: false },
        {
          message:
            "Just okay... is ther eanything wrong? Im always here to talk",
          contact: true,
        },
        { message: "there**", contact: true },
        {
          message:
            "Yeah... I've just been feeling down lately. Haven't really been going out or doing much of anything",
          contact: false,
        },
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
      { name: "messageSpace", totalHeight: 0 },
    ]);

    // List of messages to display.
    const messageList = this.chats[this.currentChat].toReversed();

    // The y-position of each message bubble is dependent on the total heights of previous ones.
    let positionY = 0;
    // Iterate over each message and create message bubble/text game objects.
    messageList.forEach((message, index) => {
      const msgColor = message.contact ? rgb(117, 217, 50) : rgb(74, 160, 217);
      // The x-position relies on where each message came from (not dependent on other messages).
      const positionX = message.contact ? 15 : 75;
      const textData = {
        text: message.message,
        size: 12,
        width: 140,
      };
      const textInfo = formatText(textData);
      if (index === 0) {
        // 12px border around the bubble + 15px buffer from bottom of screen.
        positionY -= textInfo.height + 27;
      } else {
        // 12px border around the bubble, + 10px buffer from last message.
        positionY -= textInfo.height + 22;
      }
      const msg = this.messageSpace.add([
        pos(positionX, positionY),
        rect(textInfo.width + 10, textInfo.height + 12, { radius: 10 }),
        color(msgColor),
        opacity(0),
        timer(),
        "messageBubble",
        { name: "messageBubble" },
      ]);
      msg.add([
        pos(6, 6),
        text(textData.text, {
          size: textData.size,
          width: textData.width - 10,
        }),
        color(0, 0, 0),
        opacity(0),
        timer(),
        "messageText",
        { name: "messageText" },
      ]);
    });
    this.messageSpace.totalHeight = positionY;
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
    const { messageSpace } = this;
    const scrollListener = messageSpace.onScroll((vector) => {
      if (
        vector.y > 0 &&
        -messageSpace.totalHeight -
          (messageSpace.pos.y - this.messageMask.height) <=
          this.messageMask.height
      )
        return;
      if (vector.y < 0 && messageSpace.pos.y <= this.messageMask.height) return; // Don't scroll below most recent message.
      messageSpace.pos.y += vector.y;
    });
    this.listeners.push(scrollListener);
  }
}
