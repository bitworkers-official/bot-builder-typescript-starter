import { WaterfallDialog } from 'botbuilder-dialogs'
// TODO fix eslint bug
// eslint-disable-next-line import/named
import { UserAccessor, UserMiniDialogs } from '../types'

/**
 * A dialog that displays a user name after it has been collected.
 */
export function HelloUser(userAccessor: UserAccessor) {
  const miniDialogs: UserMiniDialogs = {
    /**
     * display the saved information to the user
     */
    async displayProfile(step) {
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
      HelloUser.name,
      Object.values(miniDialogs).map(miniDialog => miniDialog.bind(miniDialogs))
    ),
  ]
}
