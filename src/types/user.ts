import { DialogTurnResult } from 'botbuilder-dialogs'
import { StateAccessor } from 'botbuilder-adapter'
import { Step, State } from '.'

export type User = Partial<
  State<{
    age: number
    name: string
  }>
>

export type UserAccessor = StateAccessor<User>

export interface UserMiniDialogs {
  [key: string]: (step: Step<User>) => Promise<DialogTurnResult<any>>
}
