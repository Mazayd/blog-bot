const { CommonView } = require('../view/common-views');
const { Keyboards } = require('../keyboards/keyboard');
const { NicknameUserView } = require('../view/nickname-user-view');
const { UserPostView } = require('../view/user-post-view');

class UserPostController {
	#userServices;
	#postServices;
	#commentServices;
	#commonView;
	#nickNameUserView;
	#userPostView;
	#keyboards;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#commonView = new CommonView(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
		this.#nickNameUserView = new NicknameUserView(UserServices, PostServices, CommentServices);
		this.#userPostView = new UserPostView(UserServices, PostServices, CommentServices);
	}

	async userPost(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.newPost')) {
			this.#userPostView.newPost(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getPost')) {
			ctx.session.post_iterator = 0;
			const post = await this.#postServices.getPostById(ctx.session.user.posts[0]);
			if (!post) {
				return this.#commonView.notPost(ctx);
			}
			ctx.session.post = post;
			this.#userPostView.getMyPost(ctx, post);
		} else {
			this.#commonView.userPost(ctx);
		}
	}

	async newPost(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#commonView.userPost(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else {
			const newPost = await this.#postServices.newPost(ctx.from.id, {
				content: ctx.message.text,
			});
			ctx.session.user.posts.unshift(newPost._id);
			this.#userPostView.choosingHashtag(ctx);
		}
	}

	async choosingHashtag(ctx) {
		const newPostId = ctx.session.user.posts[0].toString();
		if (ctx.message.text === ctx.i18n.t('buttons.skip')) {
			const post = await this.#postServices.getPostById(newPostId);
			this.#userPostView.postCreated(ctx, post);
		} else {
			const post = await this.#postServices.updatePost(newPostId, ctx.from.id, {
				hashtags: [ctx.message.text],
			});
			this.#userPostView.postCreated(ctx, post);
		}
	}

	async getMyPost(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#commonView.userPost(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getComments')) {
			ctx.session.comment_iterator = 0;
			const comment = await this.#commentServices.getCommentById(ctx.session.post.comments[0]);

			if (!comment) {
				return this.#commonView.notComment(ctx);
			}
			ctx.session.comment = comment;
			const author = await this.#userServices.getUserById(comment.user);
			this.#userPostView.getComments(ctx, comment, author);
		} else if (ctx.message.text === ctx.i18n.t('buttons.updatePost')) {
			this.#userPostView.updatePost(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.deletePost')) {
			this.#userPostView.deletePost(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.updateHashtag')) {
			this.#userPostView.updateHashtag(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.writeComment')) {
			this.#userPostView.writeComment(ctx);
		}
	}

	async getUserPostComment(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			const post = await this.#postServices.getPostById(ctx.session.user.posts[ctx.session.post_iterator]);
			ctx.session.post = post;
			this.#userPostView.getMyPost(ctx, post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.deleteComment')) {
			this.#userPostView.deleteComment(ctx);
		}
	}

	async deleteComment(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.no')) {
			const author = await this.#userServices.getUserById(ctx.session.comment.user);
			this.#userPostView.getComments(ctx, ctx.session.comment, author);
		} else if (ctx.message.text === ctx.i18n.t('buttons.yes')) {
			await this.#commentServices.deleteComment(ctx.from.id, ctx.session.comment._id);
			const post = await this.#postServices.getPostById(ctx.session.user.posts[ctx.session.post_iterator]);
			ctx.session.post = post;
			ctx.reply(ctx.i18n.t('phrases.successfulyDeleteComment'));
			this.#userPostView.getMyPost(ctx, post);
		}
	}

	async writeComment(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#userPostView.getMyPost(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else {
			await this.#commentServices.newComment(ctx.from.id, ctx.session.post._id, {
				content: ctx.message.text,
			});
			const post = await this.#postServices.getPostById(ctx.session.user.posts[ctx.session.post_iterator]);
			ctx.session.post = post;
			ctx.reply(ctx.i18n.t('phrases.commentCreated'));
			this.#userPostView.getMyPost(ctx, post);
		}
	}

	async inlineComment(ctx) {
		const { data } = ctx.update.callback_query;
		const { post } = ctx.session;

		if (data === '🖤' || data === '❤️') {
			const newComment = await this.#commentServices.likeComment(ctx.session.comment._id, ctx.from.id);
			const author = await this.#userServices.getUserById(newComment.user);
			ctx.session.comment = newComment;
			this.#commonView.changeOfComment(ctx, newComment, author);
		} else if (data === '🗑') {
			return this.#nickNameUserView.deleteUserCommentByNickname(ctx);
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
			this.#commonView.changeOfComment(ctx, comment, author);
		}
	}

	async getMyPostInline(ctx) {
		const { data } = ctx.update.callback_query;
		const { user } = ctx.session;

		if (data === '🖤' || data === '❤️') {
			const newPost = await this.#postServices.likePost(ctx.session.post._id, ctx.from.id);
			ctx.session.post = newPost;
			this.#commonView.changeOfPost(ctx, newPost);
		} else {
			const newIterator = parseInt(data);
			if (newIterator < 0) {
				ctx.session.post_iterator = user.posts.length - 1;
			} else if (newIterator === user.posts.length) {
				ctx.session.post_iterator = 0;
			} else if (newIterator === ctx.session.post_iterator) {
				return null;
			} else {
				ctx.session.post_iterator = newIterator;
			}
			const post = await this.#postServices.getPostById(user.posts[ctx.session.post_iterator]);
			ctx.session.post = post;
			this.#commonView.changeOfPost(ctx, post);
		}
	}

	async updatePost(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			const post = await this.#postServices.getPostById(ctx.session.user.posts[ctx.session.post_iterator]);
			this.#userPostView.getMyPost(ctx, post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else {
			const post = await this.#postServices.updatePost(ctx.session.user.posts[ctx.session.post_iterator], ctx.from.id, {
				content: ctx.message.text,
			});
			this.#userPostView.getMyPost(ctx, post);
		}
	}

	async deletePost(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.yes')) {
			await this.#postServices.deletePost(ctx.session.user.posts[ctx.session.post_iterator], ctx.from.id);
			const user = await this.#userServices.getUserByTgId(ctx.from.id);
			ctx.session.user = user;
			this.#userPostView.successfullyRemoved(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.no')) {
			const post = await this.#postServices.getPostById(ctx.session.user.posts[ctx.session.post_iterator]);
			this.#userPostView.getMyPost(ctx, post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else {
			this.#userPostView.deletePost(ctx);
		}
	}

	async updateHashtag(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#userPostView.getMyPost(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.deleteHashtag')) {
			this.#userPostView.deleteHashtag(ctx);
		} else {
			const newPost = await this.#postServices.updatePost(ctx.session.post._id, ctx.from.id, {
				hashtags: ctx.message.text.split(', '),
			});
			ctx.session.post = newPost;
			ctx.reply(ctx.i18n.t('phrases.successfullyUpdateHashtag'));
			this.#userPostView.getMyPost(ctx, ctx.session.post);
		}
	}

	async deleteHashtag(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.no')) {
			this.#userPostView.updateHashtag(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.yes')) {
			const newPost = await this.#postServices.updatePost(ctx.session.post._id, ctx.from.id, {
				hashtags: [],
			});
			ctx.session.post = newPost;
			ctx.reply(ctx.i18n.t('phrases.successfulyDeleteHashtag'));
			this.#userPostView.getMyPost(ctx, ctx.session.post);
		}
	}
}

module.exports = {
	UserPostController,
};
