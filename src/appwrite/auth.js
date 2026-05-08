import { Client, Account,ID } from "appwrite";
import config from "../config/config";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password,name);
            if (userAccount) {
                // Account created successfully
                return this.login({email, password});
            }
            else{
                return userAccount;
            }
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }

    async login({email, password}) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
                return session;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }

}

const authService = new AuthService();

export default authService;