---
to: src/dialogs/<%= h.inflection.titleize(name) %>/<%= h.inflection.titleize(name) %>.unit.ts
---
import { TurnContext, ActivityTypes } from 'botbuilder'
import { createAdapter, createTestAdapter } from 'botbuilder-adapter'
// eslint-disable-next-line import/named
import { User } from '@/types/user'
import { <%= h.inflection.titleize(name) %> } from './<%= h.inflection.titleize(name) %>'

function createBot(initialState: User) {
  const adapter = createAdapter()
  const userState = adapter.useState<User>(initialState)
  adapter.addDialogs(<%= h.inflection.titleize(name) %>(userState))
  adapter.onTurn = async (turnContext: TurnContext) => {
    if (turnContext.activity.type === ActivityTypes.Message) {
      const dialogContext = await adapter.createDialogContext()
      await dialogContext.continueDialog()
      if (!turnContext.responded) {
        await dialogContext.beginDialog(<%= h.inflection.titleize(name) %>.name)
      }
    }
  }
  return createTestAdapter(adapter)
}

test('Greets the user', async () => {
  await createBot({ name: 'Mr. Robot' })
    .send('Hello')
    .assertReply('Hello Mr. Robot')
})
