const { RegisterView } = require('../view/register-view');
const { CommonView } = require('../view/common-views');

class RegisterController {
	#userServices;
	#postServices;
	#commentServices;
	#commonView;
	#registerView;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#commonView = new CommonView(UserServices, PostServices, CommentServices);
		this.#registerView = new RegisterView(UserServices, PostServices, CommentServices);
	}

	async firstChoiceNickname(ctx) {
		const nickname = await this.#userServices.getUserByNickName(ctx.message.text);
		if (nickname) {
			this.#registerView.busyNickname(ctx);
		} else {
			const newUser = await this.#userServices.createUser({
				name: ctx.from.first_name,
				nickName: ctx.message.text,
				telegramId: ctx.from.id,
			});
			this.#registerView.firstChoiceAgeView(ctx);
		}
	}

	async firstChoiceAge(ctx) {
		await this.#userServices.updateUser(ctx.from.id, {
			age: parseInt(ctx.message.text),
		});
		this.#registerView.firstChoiceSexView(ctx);
	}

	async firstChoiceSex(ctx) {
		if (ctx.message.text !== (ctx.i18n.t('buttons.men') || ctx.i18n.t('buttons.women'))) {
			this.#registerView.firstChoiceSexView(ctx);
		} else {
			await this.#userServices.updateUser(ctx.from.id, {
				sex: ctx.message.text,
			});
			this.#commonView.mainMenu(ctx);
		}
	}
}

module.exports = {
	RegisterController,
};
