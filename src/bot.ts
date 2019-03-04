import { TurnContext, ActivityTypes } from 'botbuilder'
import { createAdapter } from 'botbuilder-adapter'
import { User } from '@/types/user'
import * as Dialogs from '@/dialogs'

export function MultiTurnBot() {
  const adapter = createAdapter()
  const userState = adapter.useState<User>({})
  adapter.addDialogs(Dialogs.WhoAreYou(userState))
  adapter.addDialogs(Dialogs.HelloUser(userState))
  adapter.onTurn = async (turnContext: TurnContext) => {
    if (turnContext.activity.type === ActivityTypes.Message) {
      const dialogContext = await adapter.createDialogContext(turnContext)
      await dialogContext.continueDialog()
      if (!turnContext.responded) {
        const user = await userState.get(turnContext)
        if (!user.name) {
          await dialogContext.beginDialog(Dialogs.WhoAreYou.name)
        } else {
          await dialogContext.beginDialog(Dialogs.HelloUser.name)
        }
      }
    }
  }
  return adapter
}
