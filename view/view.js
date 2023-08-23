class View {
  #userServices;
  #postServices;
  #commentServices;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
  }

  async firstChoiseNicknameView(ctx) {
    ctx.reply(ctx.i18n.t("phrases.firstChoiseNickname"));
    ctx.scene.enter("firstChoiceNickname");
  }

  async busyNickname(ctx) {
    ctx.reply(ctx.i18n.t("phrases.busyNickname"));
    ctx.scene.enter("firstChoiceNickname");
  }

  async mainMenu(ctx) {
    ctx.reply(ctx.i18n.t("phrases.mainMenu"));
    ctx.scene.enter("mainMenu");
  }
}

module.exports = {
  View,
};
