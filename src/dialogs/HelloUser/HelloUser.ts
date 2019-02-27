import { WaterfallDialog } from 'botbuilder-dialogs'
import { UserAccessor, UserMiniDialogs } from '@/types/user'

/**
 * A dialog that displays a user name after it has been collected.
 */
export function HelloUser(userAccessor: UserAccessor) {
  const miniDialogs: UserMiniDialogs = {
    /**
     * display the saved information to the user
     */
    async displayProfile(step) {
      const user = await userAccessor.get()
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

  return [new WaterfallDialog(HelloUser.name, Object.values(miniDialogs))]
}
