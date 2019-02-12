/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import {
  ConversationState,
  MemoryStorage,
  TestAdapter,
  UserState,
} from 'botbuilder-core'
import { MultiTurnBot } from '../src/bot'

!(async () => {
  const memoryStorage = new MemoryStorage()
  const conversationState = new ConversationState(memoryStorage)
  const userState = new UserState(memoryStorage)
  const bot = MultiTurnBot(conversationState, userState)
  const adapter = new TestAdapter(bot.onTurn)

  await adapter
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('42')
    .assertReply('I will remember that you are 42 years old.')
    .send('ok')
    .assertReply('Your name is Mr Robot and you are 42 years old.')
})()
