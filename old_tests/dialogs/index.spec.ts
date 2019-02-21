import { createAdapter } from '../util'
import { MultiTurnBot } from '../../src/bot'

test('remembers when an age is given', async () => {
  await createAdapter(MultiTurnBot)
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('42')
    .assertReply('I will remember that you are 42 years old.')
    .send('ok')
    .assertReply('Your name is Mr. Robot and you are 42 years old.')
})

test('remembers when no age is given', async () => {
  await createAdapter(MultiTurnBot)
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('no')
    .assertReply('No age given.')
    .send('ok')
    .assertReply('Your name is Mr. Robot and you did not share your age.')
})
