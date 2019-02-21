/* eslint-disable no-case-declarations */
import {
  ActivityTypes,
  UserState,
  ConversationState,
  TurnContext,
} from 'botbuilder'
import { DialogSet } from 'botbuilder-dialogs'
import * as Dialogs from './dialogs'
// TODO fix eslint bug
// eslint-disable-next-line import/named
import { UserAccessor } from './types'

/**
 * keys of permanent state objects which are kept as long as the conversation goes
 */
const Properties = {
  DIALOG_STATE: 'DIALOG_STATE' as 'DIALOG_STATE',
  USER_STATE: 'USER_STATE' as 'USER_STATE',
}

/**
 * creates a bot
 */
export function MultiTurnBot(
  conversationState: ConversationState,
  userState: UserState
) {
  const dialogState = conversationState.createProperty(Properties.DIALOG_STATE)
  // create accessor state that is available during the whole conversation
  const userAccessor: UserAccessor = userState.createProperty(
    Properties.USER_STATE
  )
  // create a dialog set and register all the dialogs
  const dialogSet = new DialogSet(dialogState)
  for (const dialog of Dialogs.WhoAreYou(userAccessor)) {
    dialogSet.add(dialog)
  }
  for (const dialog of Dialogs.HelloUser(userAccessor)) {
    dialogSet.add(dialog)
  }

  /**
   * this is called after each conversation update, e.g. if the user sent us a message
   */
  async function onTurn(turnContext: TurnContext) {
    switch (turnContext.activity.type) {
      case ActivityTypes.Message:
        const context = await dialogSet.createContext(turnContext)
        const utterance = (turnContext.activity.text || '').trim().toLowerCase()
        if (utterance === 'cancel') {
          if (context.activeDialog) {
            await context.cancelAllDialogs()
            await context.context.sendActivity(`Ok... canceled.`)
          } else {
            await context.context.sendActivity(`Nothing to cancel.`)
          }
        }

        // If the bot has not yet responded, continue processing the current dialog.
        await context.continueDialog()

        // Start the sample dialog in response to any other input.
        if (!turnContext.responded) {
          const user = await userAccessor.get(context.context, {})
          if (user.name) {
            await context.beginDialog(Dialogs.HelloUser.name)
          } else {
            await context.beginDialog(Dialogs.WhoAreYou.name)
          }
        }
        break
      case ActivityTypes.ConversationUpdate:
        // send a description to all new users
        if (
          turnContext.activity.membersAdded &&
          turnContext.activity.membersAdded.length !== 0
        ) {
          const newUsers = turnContext.activity.membersAdded.filter(
            member => member.id !== turnContext.activity.recipient.id
          )
          const description = `I am a bot that demonstrates the TextPrompt and NumberPrompt classes to collect your name and age, then store those values in UserState for later use. Say anything to continue.`
          const sendDescriptionPromises = newUsers.map(() =>
            turnContext.sendActivity(description)
          )
          await Promise.all(sendDescriptionPromises)
        }
        break
      default:
        break
    }

    // Save the state for the next turn
    await userState.saveChanges(turnContext)
    await conversationState.saveChanges(turnContext)
  }

  return {
    onTurn,
  }
}
