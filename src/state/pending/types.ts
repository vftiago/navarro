// Pending action types that will be processed by PhaseManager
export type PendingAction =
  | {
      cardId: string;
      handIndex: number;
      type: "PLAY_CARD";
    }
  | {
      type: "INITIATE_RUN";
    }
  | {
      iceId: string;
      type: "CLICK_ICE";
    }
  | {
      cardId: string;
      type: "SELECT_ACCESSED_CARD";
    };

export type PendingState = {
  pendingAction: null | PendingAction;
};

// Action types enum
export enum PendingActionTypes {
  CLEAR_PENDING_ACTION = "CLEAR_PENDING_ACTION",
  SET_PENDING_ACTION = "SET_PENDING_ACTION",
}

// Redux action types
export type PendingActionType =
  | {
      type: PendingActionTypes.CLEAR_PENDING_ACTION;
    }
  | {
      payload: PendingAction;
      type: PendingActionTypes.SET_PENDING_ACTION;
    };
