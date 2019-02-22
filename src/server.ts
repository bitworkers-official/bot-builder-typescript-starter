import * as restify from 'restify'
import {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
} from 'botbuilder'
import { BotConfiguration } from 'botframework-config'
import { config } from 'dotenv'
import * as path from 'path'
import { MultiTurnBot } from './bot'

config() // enable environment variables like process.env.FOO

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}.`)
  console.log(
    `\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator.`
  )
  console.log(
    `\nTo talk to your bot, open multi-turn-prompt.bot file in the emulator.`
  )
})

// .bot file path
const BOT_FILE = path.join(__dirname, '..', process.env.botFilePath as string)

// Read the configuration from a .bot file.
// This includes information about the bot's endpoints and Bot Framework configuration.
let botConfig!: BotConfiguration
try {
  // Read bot configuration from .bot file.
  botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret)
} catch (error) {
  console.error(
    `\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`
  )
  console.error(
    `\n - The botFileSecret is available under appsettings for your Azure Bot Service bot.`
  )
  console.error(
    `\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.\n\n`
  )
  process.exit()
}

const DEV_ENVIRONMENT = 'development'

// Define the name of the bot, as specified in .bot file.
// See https://aka.ms/about-bot-file to learn more about .bot files.
const BOT_CONFIGURATION = process.env.NODE_ENV || DEV_ENVIRONMENT

// Load the configuration profile specific to this bot identity.
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION)

// Create the adapter. See https://aka.ms/about-bot-adapter to learn more about using information from
// the .bot file when configuring your adapter.
const adapter = new BotFrameworkAdapter({
  // @ts-ignore
  appId: endpointConfig.appId || process.env.microsoftAppID,
  // @ts-ignore
  appPassword: endpointConfig.appPassword || process.env.microsoftAppPassword,
})

// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage()

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage)

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  console.error(`\n [onTurnError]: ${error}`)
  // Send a message to the user
  await context.sendActivity(`Oops. Something went wrong!`)
  // Clear out state
  await conversationState.delete(context)
}

// Create the main dialog, which serves as the bot's main handler.
const bot = MultiTurnBot()

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async turnContext => {
    // Route the message to the bot's main handler.
    await bot.onTurn(turnContext)
  })
})
