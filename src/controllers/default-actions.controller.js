const UserServices = require('blog-api-lib/services/UserServices');
const { CommonView } = require('../view/common-views');
const { Keyboards } = require('../keyboards/keyboard');
const { RegisterView } = require('../view/register-view');
class DefaultActionController {
	#userServices;
	#postServices;
	#commentServices;
	#commonView;
	#registerView;
	#keyboard;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#commonView = new CommonView(UserServices, PostServices, CommentServices);
		this.#registerView = new RegisterView(UserServices, PostServices, CommentServices);
		this.#keyboard = new Keyboards();
	}

	async startReply(ctx) {
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		if (!user) {
			this.#registerView.firstChoiceNicknameView(ctx);
		} else {
			ctx.session.user = user;
			const userData = await this.userData(ctx, user);
			ctx.reply(`${ctx.i18n.t('phrases.mainMenu')}\n\n${userData}`, this.#keyboard.mainMenu(ctx));
			ctx.scene.enter('mainMenu');
		}
	}

	async noSceneReply(ctx) {
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		if (!user) {
			this.#registerView.firstChoiceNicknameView(ctx);
		} else {
			ctx.session.user = user;
			const userData = await this.userData(ctx, user);
			ctx.reply(`${ctx.i18n.t('phrases.noSceneMessage')}\n\n${userData}`, this.#keyboard.mainMenu(ctx));
			ctx.scene.enter('mainMenu');
		}
	}

	async userData(ctx, user) {
		const userData = ctx.i18n
			.t('phrases.userData')
			.replace('$telegramId', user.telegramId)
			.replace('$userName', user.name)
			.replace('$userNickname', user.nickName)
			.replace('$userAge', user.age)
			.replace('$userSex', user.sex);
		return userData;
	}
}

module.exports = {
	DefaultActionController,
};
