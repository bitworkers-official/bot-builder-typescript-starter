import {
  TextPrompt,
  ChoicePrompt,
  NumberPrompt,
  WaterfallDialog,
} from 'botbuilder-dialogs'
// TODO fix eslint bug
// eslint-disable-next-line import/named
import { UserMiniDialogs, UserAccessor } from '@/types/user'

/**
 * A dialog that asks the user for his/her name and age
 */
export function WhoAreYou(userAccessor: UserAccessor) {
  const miniDialogs: UserMiniDialogs = {
    /**
     * prompts the user for their name
     */
    async name(step) {
      return step.prompt(this.name.name, `What's is your name?`)
    },
    /**
     * asks the user if he/she wants to give his/her age
     */
    async confirmAgePrompt(step) {
      const user = await userAccessor.get()
      await userAccessor.set({ ...user, name: step.result })
      return step.prompt(this.confirmAgePrompt.name, {
        prompt: 'Do you want to give your age?',
        choices: ['yes', 'no'],
      })
    },
    /**
     * asks a user for his/her age, only if he/she wants to give his/her age
     */
    async promptForAge(step) {
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
    async captureAge(step) {
      const user = await userAccessor.get()
      if (step.result !== -1) {
        await userAccessor.set({ ...user, age: step.result })
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
      WhoAreYou.name,
      Object.values(miniDialogs).map(miniDialog => miniDialog.bind(miniDialogs))
    ),
  ]
}
