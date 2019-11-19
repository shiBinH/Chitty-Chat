export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    myCustomData?: string;
    friendList: string[];
    chatrooms: string[];
    chatroomsRef?: string[];
}
