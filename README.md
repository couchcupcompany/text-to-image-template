# Text To Image App

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/text-to-image-template)

![Text To Image Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/dddfe97e-e689-450b-d5a9-d49801da6a00/public)

<!-- dash-content-start -->

Generate and edit images based on text prompts and multi-reference images using [Workers AI](https://developers.cloudflare.com/workers-ai/) and [FLUX.2 [klein] 4B](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) (`@cf/black-forest-labs/flux-2-klein-4b`).

Features:
- **Ultra-fast 4-step distilled inference** with Black Forest Labs' FLUX.2 Klein model.
- **Interactive Web Studio UI**: Text-to-Image generation and Image Edit / Reference mode with drag-and-drop upload.
- **Multi-reference Image Support**: Upload up to 4 reference images (`input_image_0` through `input_image_3`) to guide or edit compositions.
- **Iterative Editing**: "Use as Reference" button to feed generated images directly back into the reference slot.
- **Developer API**: Programmatic HTTP endpoints supporting both `multipart/form-data` and `application/json`.

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/text-to-image-template
```

A live public deployment of this template is available at [https://text-to-image-template.templates.workers.dev](https://text-to-image-template.templates.workers.dev)

## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm install
   ```
2. Deploy the project!
   ```bash
   npx wrangler deploy
   ```
3. Monitor your worker
   ```bash
   npx wrangler tail
   ```

## API Usage

### Text-to-Image Generation
```bash
curl -X POST https://YOUR_WORKER_URL/api/generate \
  -F "prompt=cyberpunk cat in neon Tokyo" \
  -F "width=1024" \
  -F "height=1024" \
  --output result.jpg
```

### Image Reference Upload & Editing
```bash
curl -X POST https://YOUR_WORKER_URL/api/generate \
  -F "prompt=Transform input_image_0 into an oil painting on canvas" \
  -F "input_image_0=@portrait.jpg" \
  -F "width=1024" \
  -F "height=1024" \
  --output edited.jpg
```
