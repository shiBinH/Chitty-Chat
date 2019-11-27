import { Chat } from './chat.model';

/**
 * chatroom is an interface object with the properties
 *          coinciding to our cloud firestore /chatrooms collection.
 *          Also has a Chat collection which is defined in chat.model.tsff
 */

export interface Chatroom {
    /**
     * user id
     */
    uid: string;
    /**
     * stores the chat messages
     */
    chats: Chat[];
    /**
     * Stores the user id of the members of the chatroom
     */
    members: string[];
    /**
     * name of chatroom
     */
    roomName: string;
    /**
     * google avatar photo link
     */
    created_at: string;
}
