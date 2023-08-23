const { Keyboards } = require("../src/keyboards/keyboard");

class View {
  #userServices;
  #postServices;
  #commentServices;
  #keyboards;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
    this.#keyboards = new Keyboards();
  }

  async firstChoiceNicknameView(ctx) {
    ctx.reply(ctx.i18n.t("phrases.firstChoiceNickname"));
    ctx.scene.enter("firstChoiceNickname");
  }

  async busyNickname(ctx) {
    ctx.reply(ctx.i18n.t("phrases.busyNickname"));
    ctx.scene.enter("firstChoiceNickname");
  }

  async firstChoiceAgeView(ctx) {
    ctx.reply(ctx.i18n.t("phrases.firstChoiceAge"));
    ctx.scene.enter("firstChoiceAge");
  }

  async firstChoiceSexView(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.firstChoiceSex"),
      this.#keyboards.choiceSex(ctx)
    );
    ctx.scene.enter("firstChoiceSex");
  }

  async mainMenu(ctx) {
    ctx.reply(ctx.i18n.t("phrases.mainMenu"), this.#keyboards.mainMenu(ctx));
    ctx.scene.enter("mainMenu");
  }
}

module.exports = {
  View,
};
