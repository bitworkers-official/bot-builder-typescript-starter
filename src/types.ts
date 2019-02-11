import {
  WaterfallStepContext,
  Prompt,
  WaterfallDialog,
  DialogTurnResult,
} from 'botbuilder-dialogs'
import { StatePropertyAccessor } from 'botbuilder'

/**
 * an accessor is an object with the methods get() and set() for storing data
 */
type Accessor<T> = StatePropertyAccessor<T>

interface User {
  readonly age?: number
  readonly name?: string
}
export type UserAccessor = Accessor<User>

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
