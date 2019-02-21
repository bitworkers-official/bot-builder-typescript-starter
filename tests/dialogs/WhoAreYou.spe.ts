import { createAdapter } from '../../bot/adapter'

function createBot() {
  const adapter = createAdapter()
}

test('Remembers when no age is given', async () => {
  await createBot()
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('no')
    .assertReply('No age given.')
})

test('Remembers when an age is given', async () => {
  await createBot()
    .send('Hello')
    .assertReply("What's is your name?")
    .send('Mr. Robot')
    .assertReply('Do you want to give your age? (1) yes or (2) no')
    .send('yes')
    .assertReply('What is your age?')
    .send('42')
    .assertReply('I will remember that you are 42 years old.')
})
