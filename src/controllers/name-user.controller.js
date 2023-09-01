const { View } = require('../view/view');
const { NameUserView } = require('../view/name-user-view');
const { Keyboards } = require('../keyboards/keyboard');

class NameUserController {
	#userServices;
	#postServices;
	#commentServices;
	#view;
	#nameUserView;
	#keyboards;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#view = new View(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
		this.#nameUserView = new NameUserView(UserServices, PostServices, CommentServices);
	}
	async getUserByName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.getAnotherUser(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else {
			const users = await this.#userServices.getUsersByName(ctx.message.text);

			if (!users.length) {
				return this.#nameUserView.usersNotFound(ctx);
			}

			ctx.session.users_list = users;
			ctx.session.user_iterator = 0;
			ctx.session.user = users[0];
			this.#nameUserView.processUsersByName(ctx, users[0]);
		}
	}

	async processUsersByName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nameUserView.getUserByName(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getPostAnotherUser')) {
			if (ctx.session.user.telegramId !== ctx.from.id.toString()) {
				ctx.session.post_iterator = 0;
				const post = await this.#postServices.getPostById(ctx.session.user.posts[0]);

				if (!post) {
					return this.#view.notAnotherPost(ctx);
				}

				ctx.session.post = post;
				return this.#nameUserView.getUserPostByName(ctx, post);
			}
			this.#view.userPost(ctx);
		}
	}

	async getUserPostByName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nameUserView.processUsersByName(ctx, ctx.session.user);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.writeComment')) {
			this.#nameUserView.writeUserCommentByName(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getComments')) {
			ctx.session.comment_iterator = 0;
			const comment = await this.#commentServices.getCommentById(ctx.session.post.comments[0]);

			if (!comment) {
				return this.#view.notComment(ctx);
			}

			ctx.session.comment = comment;
			const author = await this.#userServices.getUserById(comment.user);
			this.#nameUserView.getUserCommentByName(ctx, comment, author);
		}
	}

	async getUserCommentByName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nameUserView.getUserPostByName(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		}
	}

	async deleteUserCommentByName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.no')) {
			const author = await this.#userServices.getUserById(ctx.session.comment.user);
			this.#nameUserView.getUserCommentByName(ctx, ctx.session.comment, author);
		} else if (ctx.message.text === ctx.i18n.t('buttons.yes')) {
			const deleteComment = await this.#commentServices.deleteComment(ctx.from.id, ctx.session.comment._id);

			if (!deleteComment) {
				return ctx.reply(ctx.i18n.t('phrases.notDelete'));
			}

			const post = await this.#postServices.getPostById(deleteComment.post);
			ctx.session.post = post;

			ctx.reply(ctx.i18n.t('phrases.successfulyDeleteComment'));
			this.#nameUserView.getUserPostByName(ctx, ctx.session.post);
		}
	}

	async writeUserCommentByName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nameUserView.getUserPostByName(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else {
			await this.#commentServices.newComment(ctx.from.id, ctx.session.post._id, {
				content: ctx.message.text,
			});
			const post = await this.#postServices.getPostById(ctx.session.post._id);
			ctx.session.post = post;
			ctx.reply(ctx.i18n.t('phrases.commentCreated'));
			this.#nameUserView.getUserPostByName(ctx, post);
		}
	}

	async inlineComment(ctx) {
		const { data } = ctx.update.callback_query;
		const { post } = ctx.session;

		if (data === '🖤' || data === '❤️') {
			const newComment = await this.#commentServices.likeComment(ctx.session.comment._id, ctx.from.id);
			const author = await this.#userServices.getUserById(newComment.user);
			ctx.session.comment = newComment;
			this.#view.changeOfComment(ctx, newComment, author);
		} else if (data === '🗑') {
			return this.#nameUserView.deleteUserCommentByName(ctx);
		} else {
			const newIterator = parseInt(data);
			if (newIterator < 0) {
				ctx.session.comment_iterator = post.comments.length - 1;
			} else if (newIterator === post.comments.length) {
				ctx.session.comment_iterator = 0;
			} else if (newIterator === ctx.session.comment_iterator) {
				return null;
			} else {
				ctx.session.comment_iterator = newIterator;
			}
			const comment = await this.#commentServices.getCommentById(post.comments[ctx.session.comment_iterator]);
			ctx.session.comment = comment;
			const author = await this.#userServices.getUserById(comment.user);
			this.#view.changeOfComment(ctx, comment, author);
		}
	}

	getUserInline(ctx) {
		const newIterator = parseInt(ctx.update.callback_query.data);

		if (newIterator < 0) {
			ctx.session.user_iterator = ctx.session.users_list.length - 1;
		} else if (newIterator === ctx.session.users_list.length) {
			ctx.session.user_iterator = 0;
		} else if (newIterator === ctx.session.user_iterator) {
			return null;
		} else {
			ctx.session.user_iterator = newIterator;
		}

		const user = ctx.session.users_list[ctx.session.user_iterator];
		ctx.session.user = user;

		this.#nameUserView.changeOfUser(ctx, user);
	}
}

module.exports = {
	NameUserController,
};
