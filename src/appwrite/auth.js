import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';

class AuthService {
	client = new Client();
	account;
	constructor() {
		this.client
			.setEndpoint(conf.appwriteUrl)
			.setProject(conf.appwriteProjectId);
		this.account = new Account(this.client);
	}

	async createAccount({ email, password, name }) {
		try {
			const userAccount = await this.account.create(
				ID.unique(),
				email,
				password,
				name
			);
			if (userAccount) {
				return this.login({ email, password });
			}
		} catch (error) {
			throw error;
		}
	}

	async login({ email, password }) {
		try {
			const loginUser = await this.account.createEmailPasswordSession(
				email,
				password
			);

			if (!loginUser) {
				return 'Error while logging in';
			}
		} catch (error) {
			throw error;
		}
	}

	async getCurrentUser() {
		try {
			const currentUser = await this.account.get();
			if (currentUser) {
				return currentUser;
			} else {
				return null;
			}
		} catch (error) {
			console.log('Error in getting user');
		}
		return null;
	}

	async logout() {
		try {
			return await this.account.deleteSessions();
		} catch (error) {
			console.log('Error in logout');
		}
	}
}

const authService = new AuthService();
export default authService;
