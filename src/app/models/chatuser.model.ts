/**
 * chatuser is an interface object used with the properties
 *      coinciding to our cloud firestore /chatrooms collection.
 *
 */
export interface Chatuser {
    /**
     * user id
     */
    uid: string;
    /**
     * name of user
     */
    display_name: string;
    /**
     * email of user
     */
    email: string;
    /**
     * holds a list of chatrooms
     */
    friendList: string[];
    /**
     * google avatar photo link
     */
    photoURL: string;
}
