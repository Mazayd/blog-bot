const { View } = require("../view/view");

class RegisterController {
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
      this.#view.firstChoiceAgeView(ctx);
    }
  }

  async firstChoiceAge(ctx) {
    await this.#userServices.updateUser(ctx.from.id, {
      age: parseInt(ctx.message.text),
    });
    this.#view.firstChoiceSexView(ctx);
  }

  async firstChoiceSex(ctx) {
    if (
      ctx.message.text !==
      (ctx.i18n.t("buttons.men") || ctx.i18n.t("buttons.women"))
    ) {
      this.#view.firstChoiceSexView(ctx);
    } else {
      await this.#userServices.updateUser(ctx.from.id, {
        sex: ctx.message.text,
      });
      this.#view.mainMenu(ctx);
    }
  }
}

module.exports = {
  RegisterController,
};
