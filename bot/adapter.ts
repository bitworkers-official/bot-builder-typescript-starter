/* eslint-disable no-underscore-dangle */
import {
  MemoryStorage,
  UserState,
  TurnContext,
  ConversationState,
} from 'botbuilder'
import { DialogSet } from 'botbuilder-dialogs'

/**
 * A state accessor is just a proxy around a value with 'get' and 'set' methods, similar to localStorage
 */
export interface StateAccessor<T> {
  /**
   * Get the value
   */
  get: () => Promise<T>
  /**
   * Set the value
   */
  set: (value: T) => Promise<void>
}

export function createAdapter({
  storage = new MemoryStorage(),
  conversationState = new ConversationState(storage),
}: {
  storage?: MemoryStorage
  conversationState?: ConversationState
} = {}) {
  /**
   * The current turn context, needed for getting and setting state
   */
  let _turnContext: TurnContext
  /**
   * Dialog set, needed for adding and removing dialogs
   */
  const _dialogSet = new DialogSet(
    conversationState.createProperty('dialog_state')
  )
  /**
   * The onTurn function provided by the user
   */
  let _onTurn: (turnContext: TurnContext) => void | Promise<void>
  /**
   * An Array of states that the user provided
   */
  const _states: UserState[] = []
  return {
    /**
     * Add dialogs to the dialog set
     */
    addDialogs(dialogs: any) {
      for (const dialog of dialogs) {
        _dialogSet.add(dialog)
      }
    },
    createDialogContext() {
      return _dialogSet.createContext(_turnContext)
    },
    /**
     *  A proxy for the onTurn function provided by the user
     */
    get onTurn() {
      return async (turnContext: TurnContext) => {
        // assign the context so that it can be used for getting and setting state
        _turnContext = turnContext
        // make the turn that the user provided
        await _onTurn(_turnContext)
        // save every state for the next round
        await Promise.all(
          [conversationState, ..._states].map(state =>
            state.saveChanges(turnContext)
          )
        )
      }
    },
    set onTurn(onTurn: (turnContext: TurnContext) => void | Promise<void>) {
      _onTurn = onTurn
    },
    /**
     * Use state which is saved after every turn
     */
    useState<T>(initialState: T): StateAccessor<T> {
      const state = new UserState(storage)
      _states.push(state)
      const accessor = state.createProperty('state')
      return {
        async get() {
          return accessor.get(_turnContext, initialState)
        },
        async set(value: T) {
          return accessor.set(_turnContext, value)
        },
      }
    },
  }
}
