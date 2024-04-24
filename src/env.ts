import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { existsSync } from "node:fs";
import { z } from "zod";

export const env = createEnv({
	server: {
		GPT_MODEL_CONFIG_FILEPATH: z
			.string()
			.min(1)
			.refine((val) => existsSync(val), "File does not exists"),
		GPT_MODEL_FILEPATH: z
			.string()
			.min(1)
			.refine((val) => existsSync(val), "File does not exists"),
		GPT_RUN_DEVICE: z.union([z.literal("cpu"), z.literal("gpu")]).default("cpu"),
		PORT: z
			.string()
			.default("3000")
			.transform((val) => Number(val))
			.refine((val) => !Number.isNaN(val) && Number.isFinite(val), "Value must be parseable as Number")
			.refine((val) => val <= 65535, "Invalid port number value"),
		HOST: z
			.string()
			.default("localhost")
	},

	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
