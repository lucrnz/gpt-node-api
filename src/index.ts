import Fastify from "fastify";
import z from "zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import { env } from "./env";
import { createCompletion, loadModel } from "gpt4all";
import { dirname, basename } from "node:path";

const gptModel = await loadModel(basename(env.GPT_MODEL_FILEPATH), {
	verbose: true,
	modelPath: dirname(env.GPT_MODEL_FILEPATH),
	device: env.GPT_RUN_DEVICE,
	modelConfigFile: env.GPT_MODEL_CONFIG_FILEPATH,
});

const app = Fastify({
	logger: true,
});

app.register(fastifyGracefulShutdown);

const schema = z.object({
	prompt: z.string().min(1, "Field is required"),
});

app.post("/complete", async (request, reply) => {
	try {
		const body = schema.parse(request.body);

		const gptResponse = await createCompletion(gptModel, body.prompt, {
			verbose: true,
		});

		return { choices: gptResponse.choices };
	} catch (err) {
		if (err instanceof z.ZodError) {
			reply.code(StatusCodes.BAD_REQUEST);
			return {
				message: ReasonPhrases.BAD_REQUEST,
				issues: (err as z.ZodError).issues,
			};
		}

		console.error(err);
		reply.code(StatusCodes.INTERNAL_SERVER_ERROR);
		return { message: ReasonPhrases.INTERNAL_SERVER_ERROR };
	}
});

app.after(() => {
	app.gracefulShutdown((signal, next) => {
		app.log.info("Received signal to shutdown: %s", signal);
		gptModel.dispose();
		next();
	});
});

app.listen({ host: env.HOST, port: env.PORT }, (err, address) => {
	if (err) {
		throw err;
	}

	console.log(`🚀 Server is listening on ${address}`);
});
