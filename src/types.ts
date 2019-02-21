import {
  WaterfallStepContext,
  Prompt,
  WaterfallDialog,
  DialogTurnResult,
} from 'botbuilder-dialogs'
import { ConversationState, UserState, TurnContext } from 'botbuilder'
import { StateAccessor } from '../bot/adapter'

export interface User {
  readonly age?: number
  readonly name?: string
}
export type UserAccessor = StateAccessor<User>

/**
 * A step is something that can interact with the user, e.g. prompt the user for his name
 */
export type Step<T extends object> = WaterfallStepContext<T>

type UserStep = Step<User>
type UserDialog = (
  userAccessor: UserAccessor
) => (Prompt<any> | WaterfallDialog)[]
export interface UserDialogs {
  [key: string]: UserDialog
}
type UserMiniDialog = (step: UserStep) => Promise<DialogTurnResult<any>>
export interface UserMiniDialogs {
  [key: string]: UserMiniDialog
}

interface Bot {
  onTurn: (turnContext: TurnContext) => Promise<void>
}

export type CreateBot = (
  conversationState: ConversationState,
  userState: UserState
) => Bot
