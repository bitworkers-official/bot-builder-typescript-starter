/* eslint-disable no-case-declarations */
import {
  ActivityTypes,
  UserState,
  ConversationState,
  TurnContext,
  StatePropertyAccessor,
} from 'botbuilder'
import {
  ChoicePrompt,
  DialogSet,
  NumberPrompt,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext,
} from 'botbuilder-dialogs'

const PROPERTIES = {
  DIALOG_STATE: 'DIALOG_STATE',
  USER_PROFILE: 'USER_PROFILE',
}

interface User {
  readonly age?: number
  readonly name?: string
}

/**
 * type for accessing the user through userAccessor.get and userAccessor.set
 */
type UserAccessor = StatePropertyAccessor<User>

/**
 * the dialogs
 */
const Dialogs = {
  WhoAreYou(userAccessor: UserAccessor): any {
    const miniDialogs = {
      /**
       * prompts the user for their name
       */
      async name(step: WaterfallStepContext<User>) {
        return step.prompt(this.name.name, `What's is your name?`)
      },
      /**
       * asks the user if he/she wants to give his/her age
       */
      async confirmAgePrompt(step: WaterfallStepContext<User>) {
        const user = await userAccessor.get(step.context, {})
        await userAccessor.set(step.context, { ...user, name: step.result })
        return step.prompt(this.confirmAgePrompt.name, {
          prompt: 'Do you want to give your age?',
          choices: ['yes', 'no'],
        })
      },
      /**
       * asks a user for his/her age, only if he/she wants to give his/her age
       */
      async promptForAge(step: WaterfallStepContext<User>) {
        if (!step.result || step.result.value === 'no') {
          return step.next(-1)
        }
        return step.prompt(this.promptForAge.name, {
          prompt: `What is your age?`,
          retryPrompt: "That's not a number",
        })
      },
      /**
       * save the user's age
       */
      async captureAge(step: WaterfallStepContext<User>) {
        const user = await userAccessor.get(step.context, {})
        if (step.result !== -1) {
          await userAccessor.set(step.context, { ...user, age: step.result })
          await step.context.sendActivity(
            `I will remember that you are ${step.result} years old.`
          )
        } else {
          await step.context.sendActivity(`No age given.`)
        }
        return step.endDialog()
      },
    }

    return [
      new TextPrompt(miniDialogs.name.name),
      new ChoicePrompt(miniDialogs.confirmAgePrompt.name),
      new NumberPrompt(miniDialogs.promptForAge.name, async prompt => {
        if (
          !prompt.recognized.succeeded ||
          prompt.recognized.value === undefined
        ) {
          return false
        }
        if (prompt.recognized.value <= 0) {
          await prompt.context.sendActivity(`Your age can't be less than zero.`)
          return false
        }
        return true
      }),
      new WaterfallDialog(
        Dialogs.WhoAreYou.name,
        Object.values(miniDialogs).map(miniDialog =>
          miniDialog.bind(miniDialogs)
        )
      ),
    ]
  },
  /**
   * Create a dialog that displays a user name after it has been collected.
   */
  HelloUser(userAccessor: UserAccessor) {
    const miniDialogs = {
      /**
       * display the saved information to the user
       */
      async displayProfile(step: WaterfallStepContext<User>) {
        const user = await userAccessor.get(step.context, {})
        if (user.age) {
          await step.context.sendActivity(
            `Your name is ${user.name} and you are ${user.age} years old.`
          )
        } else {
          await step.context.sendActivity(
            `Your name is ${user.name} and you did not share your age.`
          )
        }
        return step.endDialog()
      },
    }

    return [
      new WaterfallDialog(
        Dialogs.HelloUser.name,
        Object.values(miniDialogs).map(miniDialog =>
          miniDialog.bind(miniDialogs)
        )
      ),
    ]
  },
}

export function MultiTurnBot(
  conversationState: ConversationState,
  userState: UserState
) {
  const dialogState = conversationState.createProperty(PROPERTIES.DIALOG_STATE)
  const userAccessor: UserAccessor = userState.createProperty(
    PROPERTIES.USER_PROFILE
  )
  const dialogSet = new DialogSet(dialogState)
  for (const dialog of Dialogs.WhoAreYou(userAccessor)) {
    dialogSet.add(dialog)
  }
  for (const dialog of Dialogs.HelloUser(userAccessor)) {
    dialogSet.add(dialog)
  }

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

    // Save changes to the user state.
    await userState.saveChanges(turnContext)

    // End this turn by saving changes to the conversation state.
    await conversationState.saveChanges(turnContext)
  }

  return {
    onTurn,
  }
}
