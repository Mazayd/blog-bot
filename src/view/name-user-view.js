const { Keyboards } = require('../keyboards/keyboard');
const {
	createUserMessage,
	sendFormattedMessage,
	createPostMessage,
	createCommentMessage,
} = require('../reusable_functions/message_utils');

class NameUserView {
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
	getUserByName(ctx) {
		ctx.reply(ctx.i18n.t('phrases.getUserByName'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('getUserByName');
	}

	usersNotFound(ctx) {
		ctx.reply(ctx.i18n.t('phrases.usersNotFound'), this.#keyboards.backAndMainMenu(ctx));
	}

	async processUsersByName(ctx, user) {
		const message = createUserMessage(ctx, user);
		const keyboard = ctx.session.users_list.length > 1 ? this.#keyboards.userInline(ctx) : null;
		ctx.reply(ctx.i18n.t('phrases.processUserByName'), this.#keyboards.processUser(ctx));
		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });
		ctx.scene.enter('processUsersByName');
	}

	async changeOfUser(ctx, user) {
		const message = createUserMessage(ctx, user);
		const keyboard = ctx.session.users_list.length > 1 ? this.#keyboards.userInline(ctx) : null;
		await ctx.editMessageText(message, { reply_markup: keyboard });
	}

	async getUserPostByName(ctx, post) {
		const message = createPostMessage(ctx, post);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		const keyboard =
			ctx.session.user.posts.length > 1
				? await this.#keyboards.myPostInline(ctx, user)
				: await this.#keyboards.myOnePostInline(ctx, user);

		ctx.reply(ctx.i18n.t('phrases.getAnotherPost'), this.#keyboards.getUserPost(ctx));
		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });
		ctx.scene.enter('getUserPostByName');
	}

	async getUserCommentByName(ctx, comment, author) {
		const message = createCommentMessage(ctx, comment, author);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		ctx.reply(ctx.i18n.t('phrases.getComment'), this.#keyboards.backAndMainMenu(ctx));
		const keyboard =
			ctx.session.post.comments.length > 1
				? await this.#keyboards.myCommentInline(ctx, user)
				: await this.#keyboards.myOneCommentInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });
		ctx.scene.enter('getUserCommentByName');
	}

	deleteUserCommentByName(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteComment'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteUserCommentByName');
	}

	writeUserCommentByName(ctx) {
		ctx.reply(ctx.i18n.t('phrases.writeComment'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('writeUserCommentByName');
	}
}

module.exports = {
	NameUserView,
};
