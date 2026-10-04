import { renderUI } from "./ui";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Accept",
};

/**
 * Helper to convert base64 data string (with or without data URI prefix) into a Blob
 */
function base64ToBlob(base64Str: string): Blob {
	const match = base64Str.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
	const mimeType = match ? match[1] : "image/jpeg";
	const rawBase64 = match ? match[2] : base64Str;
	const binary = atob(rawBase64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return new Blob([bytes], { type: mimeType });
}

/**
 * Extracts binary bytes and base64 string from Workers AI result
 */
async function parseModelOutput(
	modelOutput: unknown,
): Promise<{ bytes: Uint8Array; base64: string }> {
	if (modelOutput instanceof Uint8Array) {
		let binary = "";
		for (let i = 0; i < modelOutput.length; i++) {
			binary += String.fromCharCode(modelOutput[i]);
		}
		return { bytes: modelOutput, base64: btoa(binary) };
	}

	if (modelOutput instanceof ArrayBuffer) {
		const bytes = new Uint8Array(modelOutput);
		let binary = "";
		for (let i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return { bytes, base64: btoa(binary) };
	}

	if (modelOutput instanceof Response) {
		const buf = await modelOutput.arrayBuffer();
		const bytes = new Uint8Array(buf);
		let binary = "";
		for (let i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return { bytes, base64: btoa(binary) };
	}

	if (
		typeof modelOutput === "object" &&
		modelOutput !== null &&
		"image" in modelOutput &&
		typeof (modelOutput as { image: unknown }).image === "string"
	) {
		const rawBase64 = (modelOutput as { image: string }).image.replace(
			/^data:image\/\w+;base64,/,
			"",
		);
		const binary = atob(rawBase64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return { bytes, base64: rawBase64 };
	}

	throw new Error(`Unexpected model output format: ${typeof modelOutput}`);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, { headers: CORS_HEADERS });
		}

		const url = new URL(request.url);
		const acceptHeader = request.headers.get("accept") ?? "";
		const contentTypeHeader = request.headers.get("content-type") ?? "";

		// Serve interactive web UI for browser navigations on root
		if (
			request.method === "GET" &&
			url.pathname === "/" &&
			acceptHeader.includes("text/html") &&
			!url.searchParams.has("raw")
		) {
			return new Response(renderUI(), {
				headers: {
					"content-type": "text/html; charset=utf-8",
					...CORS_HEADERS,
				},
			});
		}

		let prompt = "cyberpunk cat";
		let width = "1024";
		let height = "1024";
		const inputImages: (Blob | null)[] = [null, null, null, null];

		if (request.method === "POST") {
			if (contentTypeHeader.includes("multipart/form-data")) {
				const formData = await request.formData();
				prompt = (formData.get("prompt") as string) || prompt;
				width = (formData.get("width") as string) || width;
				height = (formData.get("height") as string) || height;

				// Look for input_image_0 or aliases (image, image_0, file, reference)
				const ref0 =
					formData.get("input_image_0") ||
					formData.get("image_0") ||
					formData.get("image") ||
					formData.get("file") ||
					formData.get("reference");
				if (ref0 instanceof Blob) inputImages[0] = ref0;

				const ref1 = formData.get("input_image_1") || formData.get("image_1");
				if (ref1 instanceof Blob) inputImages[1] = ref1;

				const ref2 = formData.get("input_image_2") || formData.get("image_2");
				if (ref2 instanceof Blob) inputImages[2] = ref2;

				const ref3 = formData.get("input_image_3") || formData.get("image_3");
				if (ref3 instanceof Blob) inputImages[3] = ref3;
			} else if (contentTypeHeader.includes("application/json")) {
				const body = (await request.json()) as {
					prompt?: string;
					width?: number | string;
					height?: number | string;
					image?: string;
					input_image_0?: string;
					input_image_1?: string;
					input_image_2?: string;
					input_image_3?: string;
					images?: string[];
				};

				if (body.prompt) prompt = body.prompt;
				if (body.width) width = String(body.width);
				if (body.height) height = String(body.height);

				const raw0 = body.input_image_0 || body.image || (body.images && body.images[0]);
				if (raw0 && typeof raw0 === "string") inputImages[0] = base64ToBlob(raw0);

				const raw1 = body.input_image_1 || (body.images && body.images[1]);
				if (raw1 && typeof raw1 === "string") inputImages[1] = base64ToBlob(raw1);

				const raw2 = body.input_image_2 || (body.images && body.images[2]);
				if (raw2 && typeof raw2 === "string") inputImages[2] = base64ToBlob(raw2);

				const raw3 = body.input_image_3 || (body.images && body.images[3]);
				if (raw3 && typeof raw3 === "string") inputImages[3] = base64ToBlob(raw3);
			}
		} else if (request.method === "GET") {
			// Query parameter support
			prompt = url.searchParams.get("prompt") || prompt;
			width = url.searchParams.get("width") || width;
			height = url.searchParams.get("height") || height;
		}

		try {
			// Construct multipart form-data payload for @cf/black-forest-labs/flux-2-klein-4b
			const aiForm = new FormData();
			aiForm.append("prompt", prompt);
			if (width) aiForm.append("width", width);
			if (height) aiForm.append("height", height);

			for (let i = 0; i < inputImages.length; i++) {
				const img = inputImages[i];
				if (img) {
					aiForm.append(`input_image_${i}`, img, `input_image_${i}.jpg`);
				}
			}

			// Serialize FormData with proper boundary using Response
			const formResponse = new Response(aiForm);
			const multipartContentType =
				formResponse.headers.get("content-type") || "multipart/form-data";

			const aiResult = await env.AI.run(
				"@cf/black-forest-labs/flux-2-klein-4b",
				{
					multipart: {
						body: formResponse.body ?? aiForm,
						contentType: multipartContentType,
					},
				},
			);

			const { bytes, base64 } = await parseModelOutput(aiResult);

			// Return JSON if client requested JSON or if called on /api/generate
			const prefersJson =
				acceptHeader.includes("application/json") ||
				url.searchParams.get("format") === "json" ||
				url.pathname.startsWith("/api/");

			if (prefersJson) {
				return Response.json(
					{
						success: true,
						image: `data:image/jpeg;base64,${base64}`,
						prompt,
						model: "@cf/black-forest-labs/flux-2-klein-4b",
					},
					{
						headers: CORS_HEADERS,
					},
				);
			}

			// Otherwise return direct image binary
			return new Response(bytes, {
				headers: {
					"content-type": "image/jpeg",
					"cache-control": "public, max-age=3600",
					...CORS_HEADERS,
				},
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			const prefersJson =
				acceptHeader.includes("application/json") ||
				url.searchParams.get("format") === "json" ||
				url.pathname.startsWith("/api/");

			if (prefersJson) {
				return Response.json(
					{
						success: false,
						error: message,
					},
					{
						status: 500,
						headers: CORS_HEADERS,
					},
				);
			}

			return new Response(`AI Error: ${message}`, {
				status: 500,
				headers: {
					"content-type": "text/plain",
					...CORS_HEADERS,
				},
			});
		}
	},
} satisfies ExportedHandler<Env>;
