import { data } from 'react-router-dom';
import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query, ID } from 'appwrite';

class Service {
	client = new Client();
	storage;
	database;
	constructor() {
		this.client.setEndpoint(conf.appwriteUrl);
		this.client.setProject(conf.appwriteProjectId);

		this.database = new Databases(this.client);
		this.storage = new Storage(this.client);
	}

	async createPost({ title, slug, content, featuredImage, status, userId }) {
		try {
			const post = await this.database.createDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
					userId,
				}
			);

			return post;
		} catch (error) {
			console.log('Error in creating post');
		}
	}

	async updatePost(slug, { title, featuredImage, status, content }) {
		try {
			const updatedPost = await this.database.updateDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				slug,
				{
					title,
					featuredImage,
					status,
					content,
				}
			);

			return updatedPost;
		} catch (error) {
			console.log('Error while updating post');
		}
	}

	async deletePost(slug) {
		try {
			const deletedPost = await this.database.deleteDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				slug
			);

			return true;
		} catch (error) {
			console.log('Error while deleting post');
		}
	}

	async getPost(slug) {
		try {
			const post = await this.database.getDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				slug
			);
			return post;
		} catch (error) {
			console.log('Error while retrieving posts ');
		}
	}

	async getPosts(queries = [Query.equal('status', 'active')]) {
		try {
			const posts = await this.database.listDocuments(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				queries
			);

			return posts;
		} catch (error) {
			console.log('Error while getting posts');
		}
	}

	// File upload service

	async uploadFile(file) {
		try {
			return await this.storage.createFile(
				conf.appwriteBucketId,
				ID.unique(),
				file
			);
		} catch (error) {
			console.log('error while uploading file');
		}
	}

	async deleteFile(fileId) {
		try {
			await this.storage.deleteFile(conf.appwriteBucketId, fileId);
			return true;
		} catch (error) {
			console.log('Error in deleting file');
		}
	}

	async getFilePreview(fileId) {
		try {
			return await this.storage.getFilePreview(conf.appwriteBucketId, fileId);
		} catch (error) {
			console.log('Error while generating preview file');
		}
	}
}

const service = new Service();

export default service;
