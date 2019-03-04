import { TurnContext, ActivityTypes } from 'botbuilder'
import { createAdapter, createTestAdapter } from 'botbuilder-adapter'
import { User } from '@/types/user'
import { HelloUser } from './HelloUser'

function createBot(initialState: User) {
  const adapter = createAdapter()
  const userState = adapter.useState<User>(initialState)
  adapter.addDialogs(HelloUser(userState))
  adapter.onTurn = async (turnContext: TurnContext) => {
    if (turnContext.activity.type === ActivityTypes.Message) {
      const dialogContext = await adapter.createDialogContext(turnContext)
      await dialogContext.continueDialog()
      if (!turnContext.responded) {
        await dialogContext.beginDialog(HelloUser.name)
      }
    }
  }
  return createTestAdapter(adapter)
}

test('Remembers when a name and no age were given', async () => {
  await createBot({ name: 'Mr. Robot' })
    .send('Hello')
    .assertReply('Your name is Mr. Robot and you did not share your age.')
})

test('Remembers when a name and an age were given', async () => {
  await createBot({ name: 'Mr. Robot', age: 31 })
    .send('Hello')
    .assertReply('Your name is Mr. Robot and you are 31 years old.')
})
