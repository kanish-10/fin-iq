// @ts-ignore
import LlamaAI from "llamaai";

const apiToken = process.env.LLAMAAI_API_KEY!;
export const llama = new LlamaAI(apiToken);

const apiRequestJson = {
	"messages": [
		{"role": "user", "content": "Tell me about advancements in AI or the weather in Boston for the next week."},
	],
	"functions": [
		{
			"name": "process_general_query",
			"description": "Interpret and retrieve data based on open-ended user queries.",
			"parameters": {
				"type": "object",
				"properties": {
					"query_type": {
						"type": "string",
						"description": "The type of query, e.g., 'information', 'weather', 'company details', 'trends', etc.",
					},
					"subject": {
						"type": "string",
						"description": "The main topic of the query, like a specific technology, city, or company name.",
					},
					"additional_context": {
						"type": "object",
						"description": "Extra details relevant to the query, may include location, timeframe, or specific metrics.",
						"properties": {
							"location": {
								"type": "string",
								"description": "Location related to the query, if applicable"
							},
							"industry": {
								"type": "string",
								"description": "Industry type, for example, AI, Fintech, etc."
							},
							"time_frame": {
								"type": "string",
								"description": "Time period, if relevant, like 'next week' or '2023'"
							},
							"metric": {"type": "string", "description": "Specific metrics, e.g., revenue, growth rate"},
						},
					},
				},
			},
			"required": ["query_type", "subject"],
		}
	],
	"stream": false,
	"function_call": "process_general_query",
};

// Main execution function to process the request and output results dynamicall
