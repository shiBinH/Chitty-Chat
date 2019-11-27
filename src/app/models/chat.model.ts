/**
 *  Chat is an interface object with the properties
 *          coinciding to cloud firestore /chatrooms/Chat collection.
 */
export interface Chat {
    /**
     * not used
     */
    uid: string;
    /**
     * holds the message of the chat message
     */
    content: string;
    /**
     * not used
     */
    emotion: string;
    /**
     * user id that the message is from
     */
    from: string;
    /**
     * holds the string of the tone
     */
    tone_id: string;
    /**
     * its text
     */
    type: string;
    /**
     * not used
     */
    when: string;
    /**
     * not used
     */
    user: string;
}
