import {
  ConversationState,
  MemoryStorage,
  TestAdapter,
  UserState,
} from 'botbuilder-core'
import { CreateBot } from '../src/types'

export function createAdapter(createBot: CreateBot) {
  const memoryStorage = new MemoryStorage()
  const conversationState = new ConversationState(memoryStorage)
  const userState = new UserState(memoryStorage)
  const bot = createBot(conversationState, userState)
  return new TestAdapter(bot.onTurn)
}
