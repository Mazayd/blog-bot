const { Keyboards } = require('../keyboards/keyboard');

class RegisterView {
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
		ctx.reply(ctx.i18n.t('phrases.firstChoiceNickname'));
		ctx.scene.enter('firstChoiceNickname');
	}

	async busyNickname(ctx) {
		ctx.reply(ctx.i18n.t('phrases.busyNickname'));
		ctx.scene.enter('firstChoiceNickname');
	}

	async firstChoiceAgeView(ctx) {
		ctx.reply(ctx.i18n.t('phrases.firstChoiceAge'));
		ctx.scene.enter('firstChoiceAge');
	}

	async firstChoiceSexView(ctx) {
		ctx.reply(ctx.i18n.t('phrases.firstChoiceSex'), this.#keyboards.choiceSex(ctx));
		ctx.scene.enter('firstChoiceSex');
	}
}

module.exports = {
	RegisterView,
};
