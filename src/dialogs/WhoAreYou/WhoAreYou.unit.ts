import { TurnContext, ActivityTypes } from 'botbuilder'
import { createAdapter, createTestAdapter } from 'botbuilder-adapter'
import { User } from '@/types/user'
import { WhoAreYou } from './WhoAreYou'

function createBot() {
  const adapter = createAdapter()
  const userState = adapter.useState<User>({})
  adapter.addDialogs(WhoAreYou(userState))
  adapter.onTurn = async (turnContext: TurnContext) => {
    if (turnContext.activity.type === ActivityTypes.Message) {
      const dialogContext = await adapter.createDialogContext()
      await dialogContext.continueDialog()
      if (!turnContext.responded) {
        const user = await userState.get()
        if (!user.name) {
          await dialogContext.beginDialog(WhoAreYou.name)
        }
      }
    }
  }
  return createTestAdapter(adapter)
}

test('Remembers when no age is given', async () => {
  await createBot()
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('no')
    .assertReply('No age given.')
})

test('Remembers when an age is given', async () => {
  await createBot()
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('42')
    .assertReply('I will remember that you are 42 years old.')
})

test('Prompts again for age it was invalid', async () => {
  await createBot()
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('-1')
    .assertReply("Your age can't be less than zero.")
    .send('1')
    .assertReply('I will remember that you are 1 years old.')
})
