const Context = require("telegraf");
const { View } = require("../../view/view");

class ChoiceNicknameController {
  #userServices;
  #postServices;
  #commentServices;
  #view;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
    this.#view = new View(UserServices, PostServices, CommentServices);
  }
  /**
   *
   * @param {Context} ctx
   * @returns {void}
   */
  async firstChoiceNickname(ctx) {
    console.log(ctx.message.text);
    const nickname = await this.#userServices.getUserByNickName(
      ctx.message.text
    );
    console.log("nickname: ", nickname);
    if (nickname) {
      this.#view.busyNickname(ctx);
    } else {
      const newUser = await this.#userServices.createUser({
        name: ctx.from.first_name,
        nickName: ctx.message.text,
        telegramId: ctx.from.id,
      });
      console.log("newUser: ", newUser);
      this.#view.mainMenu(ctx);
    }
  }
}

module.exports = {
  ChoiceNicknameController,
};
