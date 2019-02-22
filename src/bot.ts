import { TurnContext, ActivityTypes } from 'botbuilder'
import { createAdapter } from '../bot/adapter'
import { WhoAreYou } from './dialogs/WhoAreYou/WhoAreYou'
// eslint-disable-next-line import/named
import { User } from './types/user'

export function MultiTurnBot() {
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
  return adapter
}
