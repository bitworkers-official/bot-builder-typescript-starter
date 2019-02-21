import {
  ConversationState,
  UserState,
  TurnContext,
  ActivityTypes,
} from 'botbuilder'
import { UserAccessor } from '../../src/types'
import { DialogSet } from 'botbuilder-dialogs'
import { Dialogs } from '../../src/dialogs'
import { createAdapter } from '../util'
import { Properties } from '../../src/bot'

function createBot(conversationState: ConversationState, userState: UserState) {
  const dialogState = conversationState.createProperty(Properties.DIALOG_STATE)
  const userAccessor: UserAccessor = userState.createProperty(
    Properties.USER_STATE
  )
  const dialogSet = new DialogSet(dialogState)
  for (const dialog of Dialogs.WhoAreYou(userAccessor)) {
    dialogSet.add(dialog)
  }
  async function onTurn(turnContext: TurnContext) {
    switch (turnContext.activity.type) {
      case ActivityTypes.Message:
        const context = await dialogSet.createContext(turnContext)
        await context.continueDialog()
        if (!turnContext.responded) {
          await context.beginDialog(Dialogs.WhoAreYou.name)
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

test('Remembers when no age is given', async () => {
  await createAdapter(createBot)
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('no')
    .assertReply('No age given.')
})

test('Remembers when an age is given', async () => {
  await createAdapter(createBot)
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('42')
    .assertReply('I will remember that you are 42 years old.')
})
