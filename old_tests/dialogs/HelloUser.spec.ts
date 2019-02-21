import {
  ConversationState,
  UserState,
  TurnContext,
  ActivityTypes,
} from 'botbuilder'
import { UserAccessor, User } from '../../src/types'
import { DialogSet } from 'botbuilder-dialogs'
import { Dialogs } from '../../src/dialogs'
import { createAdapter } from '../util'
import { Properties } from '../../src/bot'

const createBot = (user: User) => (
  conversationState: ConversationState,
  userState: UserState
) => {
  const dialogState = conversationState.createProperty(Properties.DIALOG_STATE)
  const userAccessor: UserAccessor = userState.createProperty(
    Properties.USER_STATE
  )
  const dialogSet = new DialogSet(dialogState)
  for (const dialog of Dialogs.HelloUser(userAccessor)) {
    dialogSet.add(dialog)
  }
  async function onTurn(turnContext: TurnContext) {
    switch (turnContext.activity.type) {
      case ActivityTypes.Message:
        const context = await dialogSet.createContext(turnContext)
        await context.continueDialog()
        if (!turnContext.responded) {
          await userAccessor.set(context.context, user)
          await context.beginDialog(Dialogs.HelloUser.name)
        }
        break
      default:
        break
    }
    await userState.saveChanges(turnContext)
    await conversationState.saveChanges(turnContext)
  }

  return {
    onTurn,
  }
}

test('Remembers when a name and no age were given', async () => {
  await createAdapter(createBot({ name: 'Mr. Robot' }))
    .send('Hello')
    .assertReply('Your name is Mr. Robot and you did not share your age.')
})

test('Remembers when a name and an age were given', async () => {
  await createAdapter(createBot({ name: 'Mr. Robot', age: 31 }))
    .send('Hello')
    .assertReply('Your name is Mr. Robot and you are 31 years old.')
})
