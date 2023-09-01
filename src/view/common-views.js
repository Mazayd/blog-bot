const { Keyboards } = require('../keyboards/keyboard');
const {
	createPostMessage,
	sendFormattedMessage,
	createCommentMessage,
	createUserMessage,
} = require('../reusable_functions/message_utils');

class CommonView {
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

	async mainMenu(ctx) {
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		ctx.session.user = user;
		const userData = ctx.i18n
			.t('phrases.userData')
			.replace('$telegramId', user.telegramId)
			.replace('$userName', user.name)
			.replace('$userNickname', user.nickName)
			.replace('$userAge', user.age)
			.replace('$userSex', user.sex);
		ctx.reply(`${ctx.i18n.t('phrases.mainMenu')}\n\n${userData}`, this.#keyboards.mainMenu(ctx));
		ctx.scene.enter('mainMenu');
	}

	async changeOfPost(ctx, post) {
		const message = createPostMessage(ctx, post);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		const keyboard =
			ctx.session.user.posts.length > 1
				? await this.#keyboards.myPostInline(ctx, user)
				: await this.#keyboards.myOnePostInline(ctx, user);

		await ctx.editMessageText(message, { reply_markup: keyboard });
	}

	async changeOfComment(ctx, comment, author) {
		const message = createCommentMessage(ctx, comment, author);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		const keyboard =
			ctx.session.post.comments.length > 1
				? await this.#keyboards.myCommentInline(ctx, user)
				: await this.#keyboards.myOneCommentInline(ctx, user);

		await ctx.editMessageText(message, { reply_markup: keyboard });
	}

	async userPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userPost'), this.#keyboards.userPost(ctx));
		ctx.scene.enter('userPost');
	}

	notPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.notPost'));
	}

	notAnotherPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.notAnotherPost'));
	}

	notComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.notComment'));
	}

	getAnotherUser(ctx) {
		ctx.reply(ctx.i18n.t('phrases.getAnotherUser'), this.#keyboards.getAnotherUser(ctx));
		ctx.scene.enter('getAnotherUser');
	}

	nicknameNotFoundMessage(ctx) {
		ctx.reply(ctx.i18n.t('phrases.nicknameNotFoundMessage'), this.#keyboards.backAndMainMenu(ctx));
	}
}

module.exports = {
	CommonView,
};
