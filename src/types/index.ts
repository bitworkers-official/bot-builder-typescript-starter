import { WaterfallStepContext } from 'botbuilder-dialogs'

/**
 * A step is something that can interact with the user, e.g. prompt the user for his name
 */
export type Step<T extends object> = WaterfallStepContext<T>

export type State<T> = Readonly<T>
