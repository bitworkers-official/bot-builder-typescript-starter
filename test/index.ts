/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import {
  ConversationState,
  MemoryStorage,
  TestAdapter,
  UserState,
} from 'botbuilder-core'
import { DialogSet } from 'botbuilder-dialogs'
// eslint-disable-next-line import/named
import { UserAccessor } from '../src/types'
import { Dialogs } from '../src/dialogs'

/**
 * keys of permanent properties which are kept as long as the conversation goes
 */
const Properties = {
  DIALOG_STATE: 'DIALOG_STATE' as 'DIALOG_STATE',
  USER_STATE: 'USER_STATE' as 'USER_STATE',
}

!(async () => {
  // Create a DialogState property, DialogSet and ChoicePrompt.
  const memoryStorage = new MemoryStorage()

  // Create conversation state with in-memory storage provider.
  const conversationState = new ConversationState(memoryStorage)
  const userState = new UserState(memoryStorage)
  const dialogState = conversationState.createProperty(Properties.DIALOG_STATE)
  const userAccessor: UserAccessor = userState.createProperty(
    Properties.USER_STATE
  )
  const dialogSet = new DialogSet(dialogState)
  for (const dialog of Dialogs.WhoAreYou(userAccessor)) {
    dialogSet.add(dialog)
  }
  for (const dialog of Dialogs.HelloUser(userAccessor)) {
    dialogSet.add(dialog)
  }

  // Initialize TestAdapter.
  const adapter = new TestAdapter(async turnContext => {
    const context = await dialogSet.createContext(turnContext)
    await context.continueDialog()
    if (!turnContext.responded) {
      const user = await userAccessor.get(context.context, {})
      if (user.name) {
        await context.beginDialog(Dialogs.HelloUser.name)
      } else {
        await context.beginDialog(Dialogs.WhoAreYou.name)
      }
    }
    // save the state for the next round
    await conversationState.saveChanges(turnContext)
    await userState.saveChanges(turnContext)
  })

  await adapter
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('42')
    .assertReply('I will remember that you are 42 years old.')
    .send('ok')
    .assertReply('Your name is Mr Robot and you are 42 years old.')
})()
