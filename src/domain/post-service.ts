import {InputPostType} from "../types/post/input";
import {PostRepository} from "../repositories/post-repository";

export class PostService {
    static async createNewPost(newPost: InputPostType) {
        const post = await PostRepository.createNewPost(newPost);
        return post;
    }
}