// @ts-ignore
import LlamaAI from "llamaai";

const apiToken = process.env.LLAMAAI_API_KEY!;
export const llama = new LlamaAI(apiToken);
