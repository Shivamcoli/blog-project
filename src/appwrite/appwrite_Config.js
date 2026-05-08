import config from "../config/config";

import { Client, ID,Databases,Storage,Query } from "appwrite";


export class Service{
    client = new Client();
    databases;
    storage;
    
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({title,slug,content, featuredImage, status, userId}) {
        try{
                const response = await this.databases.createDocument(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                        userId
                    }
                );
                return response;
        }
        catch(error){
            console.error("Error creating post:", error);
            throw error;
        }
    }

    async updatePost(slug,{ title,content, featuredImage, status}) {
        try{
            const response = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            );
            return response;
        }
        catch(error){
            console.error("Error updating post:", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try{
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return true;
        }
        catch(error){
            console.error("Error deleting post:", error);
            return false;
        }
    }

    async getPost(slug){
        try{
            const response = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return response;
        }
        catch(error){
            console.error("Error fetching post:", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status","active")]) {
        try{
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries
            );
            return response.documents;
        }
        catch(error){
            console.error("Error fetching posts:", error);
            return false;
        }
    }

    async uploadFile(file){
        try{
            return await this.storage.createFile(
                config.appwriteStorageId,
                ID.unique(),
                file
            );
        }
        catch(error){
            console.error("Error uploading file:", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try{
            await this.storage.deleteFile(
                config.appwriteStorageId,
                fileId
            );
            return true;
        }   
        catch(error){
            console.error("Error deleting file:", error);
            return false;
        }
    }

    getFilePreview(fileId){
        try{
            return this.storage.getFileView(
                config.appwriteStorageId,
                fileId
            );
        }
        catch(error){
            console.error("Error getting file:", error);
            return false;
        }
    }

}

const service = new Service();

export default service;