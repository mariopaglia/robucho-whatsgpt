import { create } from 'venom-bot'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai"

dotenv.config()

create({
	session: 'Robucho',
	multidevice: true
})
	.then((client) => start(client))
	.catch((erro) => {
		console.log(erro);
	});

const configuration = new Configuration({
	organization: process.env.ORGANIZATION_ID,
	apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const getDavinciResponse = async (clientText) => {
	const options = {
		model: "text-davinci-003",
		prompt: clientText,
		temperature: 1,
		max_tokens: 4000
	}

	try {
		const response = await openai.createCompletion(options);
		return response.data.choices[0].text.trim();
	} catch (e) {
		return;
	}
}

const sendMessage = (client, message) => {
	const isBotNumber = message.from === process.env.BOT_NUMBER;
	const senderNumber = isBotNumber ? message.to : message.from;

	getDavinciResponse(message.text).then((response) => {
		client.sendText(senderNumber, response);
	});
}

async function start(client) {
	client.onAnyMessage((message) => sendMessage(client, message));
}
