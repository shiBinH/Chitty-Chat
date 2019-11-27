/**
 * DialogData is an interface object used as a shortened
 *          description of user defined in user.model.ts
 *
 */
export interface DialogData {
  /**
   * status is public
   */
  status: string;
  /**
   * inputted room name by user
   */
  roomName: string;
  /**
   * google avatar photo link
   */
  userList: string[];
  /**
   * current user ID
   */
  ownerID: string;
  /**
   * implemented in chatbox.component.ts it gets
   */
  getChatroomList: () => void;
  }
