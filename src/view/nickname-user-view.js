const { Keyboards } = require('../keyboards/keyboard');
const {
	createPostMessage,
	sendFormattedMessage,
	createCommentMessage,
	createUserMessage,
} = require('../reusable_functions/message_utils');

class NicknameUserView {
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

	getUserByNickname(ctx) {
		ctx.reply(ctx.i18n.t('phrases.getUserByNickname'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('getUserByNickname');
	}

	processUserByNickname(ctx, user) {
		const message = createUserMessage(ctx, user);

		ctx.reply(message, this.#keyboards.processUser(ctx));
		ctx.scene.enter('processUserByNickname');
	}

	writeUserCommentByNickname(ctx) {
		ctx.reply(ctx.i18n.t('phrases.writeComment'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('writeUserCommentByNickname');
	}

	deleteUserCommentByNickname(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteComment'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteUserCommentByNickname');
	}

	async getUserPostByNickname(ctx, post) {
		const message = createPostMessage(ctx, post);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);

		ctx.reply(ctx.i18n.t('phrases.getAnotherPost'), this.#keyboards.getUserPost(ctx));

		const keyboard =
			ctx.session.user.posts.length > 1
				? await this.#keyboards.myPostInline(ctx, user)
				: await this.#keyboards.myOnePostInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });
		ctx.scene.enter('getUserPostByNickname');
	}

	async getUserCommentByNickname(ctx, comment, author) {
		const message = createCommentMessage(ctx, comment, author);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		ctx.reply(ctx.i18n.t('phrases.getComment'), this.#keyboards.backAndMainMenu(ctx));

		const keyboard =
			ctx.session.post.comments.length > 1
				? await this.#keyboards.myCommentInline(ctx, user)
				: await this.#keyboards.myOneCommentInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });

		ctx.scene.enter('getUserCommentByNickname');
	}
}

module.exports = {
	NicknameUserView,
};
