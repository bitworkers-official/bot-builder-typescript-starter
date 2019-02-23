---
to: src/dialogs/<%= h.inflection.titleize(name) %>/<%= h.inflection.titleize(name) %>.ts
---
import { WaterfallDialog } from 'botbuilder-dialogs'
import { UserAccessor, UserMiniDialogs } from '@/types/user'

export function <%= h.inflection.titleize(name) %>(userAccessor: UserAccessor) {
  const miniDialogs: UserMiniDialogs = {
    async greet(step) {
      const user = await userAccessor.get()
      await step.context.sendActivity(`Hello ${user.name}`)
      return step.endDialog()
    },
  }

  return [
    new WaterfallDialog(
      <%= h.inflection.titleize(name) %>.name,
      Object.values(miniDialogs).map(miniDialog => miniDialog.bind(miniDialogs))
    ),
  ]
}
