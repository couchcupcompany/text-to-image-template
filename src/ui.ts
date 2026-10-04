export function renderUI(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FLUX.2 Klein AI Studio · Cloudflare Workers</title>
  <meta name="description" content="Generate and edit images using FLUX.2 [klein] 4B on Cloudflare Workers AI with multi-reference image support.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090b10;
      --bg-gradient: radial-gradient(circle at 50% -20%, #1e1b4b 0%, #090b10 70%);
      --surface: #111420;
      --surface-border: rgba(255, 255, 255, 0.08);
      --surface-hover: #181d2d;
      --primary: #6366f1;
      --primary-light: #818cf8;
      --primary-glow: rgba(99, 102, 241, 0.35);
      --accent: #f43f5e;
      --accent-cyan: #06b6d4;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --card-bg: rgba(17, 20, 32, 0.7);
      --card-border: rgba(255, 255, 255, 0.07);
      --radius-lg: 16px;
      --radius-md: 12px;
      --radius-sm: 8px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      background-image: var(--bg-gradient);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      padding: 0;
      overflow-x: hidden;
    }

    /* Top Navigation */
    header {
      border-bottom: 1px solid var(--surface-border);
      background: rgba(9, 11, 16, 0.85);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }

    .logo-badge {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .logo-text {
      font-weight: 700;
      font-size: 1.125rem;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge-pill {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary-light);
      border: 1px solid rgba(99, 102, 241, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .header-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid var(--surface-border);
      background: var(--surface);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-ghost:hover {
      color: var(--text);
      background: var(--surface-hover);
      border-color: rgba(255, 255, 255, 0.15);
    }

    /* Main Container */
    main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      display: grid;
      grid-template-columns: 480px 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (max-width: 1024px) {
      main {
        grid-template-columns: 1fr;
      }
    }

    /* Control Panel Card */
    .panel {
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Tabs */
    .tabs-nav {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.25rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--surface-border);
      gap: 0.25rem;
    }

    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      color: white;
      background: var(--primary);
      box-shadow: 0 2px 10px var(--primary-glow);
    }

    .section-title {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Textarea */
    .prompt-box {
      position: relative;
    }

    .prompt-textarea {
      width: 100%;
      min-height: 110px;
      padding: 0.875rem 1rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      color: var(--text);
      font-family: inherit;
      font-size: 0.9375rem;
      line-height: 1.5;
      resize: vertical;
      transition: all 0.2s;
    }

    .prompt-textarea:focus {
      outline: none;
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }

    .prompt-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }

    .prompt-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.5rem;
    }

    .chip {
      font-size: 0.75rem;
      padding: 0.25rem 0.625rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--surface-border);
      border-radius: 9999px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s;
    }

    .chip:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--primary-light);
      color: white;
    }

    /* Reference Images Upload Grid */
    .reference-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .reference-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .ref-slot {
      position: relative;
      background: rgba(0, 0, 0, 0.3);
      border: 1.5px dashed var(--surface-border);
      border-radius: var(--radius-md);
      min-height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      overflow: hidden;
    }

    .ref-slot:hover, .ref-slot.dragover {
      border-color: var(--primary-light);
      background: rgba(99, 102, 241, 0.08);
    }

    .ref-slot.has-image {
      border-style: solid;
      border-color: rgba(99, 102, 241, 0.5);
      padding: 0;
    }

    .ref-slot img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
    }

    .ref-slot .slot-label {
      position: absolute;
      top: 6px;
      left: 6px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.6875rem;
      font-family: 'JetBrains Mono', monospace;
      color: #cbd5e1;
      z-index: 2;
    }

    .ref-slot .remove-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgba(244, 63, 94, 0.85);
      border: none;
      color: white;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 3;
    }

    .ref-slot.has-image:hover .remove-btn {
      display: flex;
    }

    .ref-slot .upload-icon {
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .ref-slot .upload-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .hidden-file-input {
      display: none;
    }

    .ref-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      background: rgba(99, 102, 241, 0.08);
      border-left: 3px solid var(--primary);
      padding: 0.5rem 0.75rem;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    /* Dimensions / Aspect Ratio */
    .aspect-pills {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .aspect-btn {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-sm);
      padding: 0.5rem 0.25rem;
      text-align: center;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .aspect-btn:hover {
      background: var(--surface-hover);
      color: var(--text);
    }

    .aspect-btn.active {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--primary-light);
      color: white;
    }

    .aspect-ratio-label {
      font-size: 0.8125rem;
      font-weight: 700;
      display: block;
    }

    .aspect-dim {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    /* Primary Generate Button */
    .generate-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      box-shadow: 0 4px 20px var(--primary-glow);
      transition: all 0.25s ease;
    }

    .generate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
      filter: brightness(1.08);
    }

    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Output Canvas Area */
    .result-container {
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      min-height: 580px;
    }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .result-title {
      font-size: 1.125rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-badge {
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      display: none;
    }

    .image-stage {
      flex: 1;
      min-height: 440px;
      border-radius: var(--radius-md);
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .stage-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--text-muted);
      text-align: center;
      padding: 2rem;
      max-width: 360px;
    }

    .placeholder-art {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
      border: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-light);
    }

    .output-image {
      max-width: 100%;
      max-height: 600px;
      object-fit: contain;
      border-radius: var(--radius-sm);
      display: none;
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Loading Overlay */
    .loader-overlay {
      position: absolute;
      inset: 0;
      background: rgba(9, 11, 16, 0.85);
      backdrop-filter: blur(8px);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      z-index: 10;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loader-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
    }

    .loader-subtitle {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    /* Action Bar */
    .result-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      display: none;
    }

    .action-btn {
      flex: 1;
      min-width: 130px;
      padding: 0.625rem 1rem;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 0.875rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--surface-hover);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .action-btn.btn-primary-action {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--primary-light);
      color: white;
    }

    .action-btn.btn-primary-action:hover {
      background: rgba(99, 102, 241, 0.35);
    }

    /* Modal / Code Drawer */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(6px);
      z-index: 200;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-card {
      background: #111420;
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 720px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 1.75rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .modal-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.25rem;
    }

    pre code {
      display: block;
      background: #08090d;
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-sm);
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #e2e8f0;
      overflow-x: auto;
      margin-top: 0.5rem;
      white-space: pre-wrap;
    }

    footer {
      border-top: 1px solid var(--surface-border);
      padding: 1.5rem;
      text-align: center;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    footer a {
      color: var(--primary-light);
      text-decoration: none;
    }
  </style>
</head>
<body>

  <header>
    <div class="header-inner">
      <a href="/" class="logo-group">
        <div class="logo-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <div>
          <div class="logo-text">
            FLUX.2 Klein Studio
            <span class="badge-pill">Workers AI</span>
          </div>
        </div>
      </a>
      <div class="header-links">
        <button id="openApiModal" class="btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          API & cURL
        </button>
        <a href="https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/" target="_blank" rel="noopener" class="btn-ghost">
          Model Docs ↗
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- Left Column: Controls -->
    <div class="panel">
      <!-- Mode Tabs -->
      <div class="tabs-nav" role="tablist">
        <button id="tabT2I" class="tab-btn active" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Text to Image
        </button>
        <button id="tabI2I" class="tab-btn" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Image Edit / Reference
        </button>
      </div>

      <!-- Reference Uploads Section (Shown when Reference Mode is active or used) -->
      <div id="referenceSection" class="reference-section" style="display: none;">
        <div class="section-title">
          <span>Reference Images (Up to 4)</span>
          <span style="font-size: 0.7rem; color: #a5b4fc;">input_image_0 .. 3</span>
        </div>
        <div class="reference-grid">
          <!-- Slot 0 -->
          <div class="ref-slot" id="slot-0" data-index="0">
            <span class="slot-label">input_image_0</span>
            <button class="remove-btn" type="button" title="Remove image">&times;</button>
            <div class="upload-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="upload-text">Upload Image 0</div>
            <input type="file" class="hidden-file-input" accept="image/*">
          </div>

          <!-- Slot 1 -->
          <div class="ref-slot" id="slot-1" data-index="1">
            <span class="slot-label">input_image_1</span>
            <button class="remove-btn" type="button" title="Remove image">&times;</button>
            <div class="upload-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <div class="upload-text">Upload Image 1</div>
            <input type="file" class="hidden-file-input" accept="image/*">
          </div>

          <!-- Slot 2 -->
          <div class="ref-slot" id="slot-2" data-index="2">
            <span class="slot-label">input_image_2</span>
            <button class="remove-btn" type="button" title="Remove image">&times;</button>
            <div class="upload-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <div class="upload-text">Upload Image 2</div>
            <input type="file" class="hidden-file-input" accept="image/*">
          </div>

          <!-- Slot 3 -->
          <div class="ref-slot" id="slot-3" data-index="3">
            <span class="slot-label">input_image_3</span>
            <button class="remove-btn" type="button" title="Remove image">&times;</button>
            <div class="upload-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <div class="upload-text">Upload Image 3</div>
            <input type="file" class="hidden-file-input" accept="image/*">
          </div>
        </div>
        <div class="ref-hint">
          💡 <strong>Editing Tip:</strong> Refer to uploaded images directly in your prompt, e.g. <em>"Make the character in input_image_0 wear a leather cyberpunk jacket with glowing neon signs in the background"</em>.
        </div>
      </div>

      <!-- Prompt Input -->
      <div class="prompt-box">
        <div class="section-title">
          <span>Prompt</span>
          <button id="surpriseBtn" class="chip" type="button">✨ Surprise Me</button>
        </div>
        <textarea id="promptInput" class="prompt-textarea" placeholder="Describe the image you want to generate or edit..." rows="3">cyberpunk cat in a rainy neon-lit Tokyo alleyway, 8k resolution, cinematic lighting</textarea>
        
        <div class="prompt-chips" id="presetChips">
          <!-- Injected via JavaScript -->
        </div>
      </div>

      <!-- Dimensions / Aspect Ratio -->
      <div>
        <div class="section-title">
          <span>Aspect Ratio & Resolution</span>
        </div>
        <div class="aspect-pills">
          <button class="aspect-btn active" data-w="1024" data-h="1024" type="button">
            <span class="aspect-ratio-label">1:1</span>
            <span class="aspect-dim">1024×1024</span>
          </button>
          <button class="aspect-btn" data-w="1024" data-h="576" type="button">
            <span class="aspect-ratio-label">16:9</span>
            <span class="aspect-dim">1024×576</span>
          </button>
          <button class="aspect-btn" data-w="576" data-h="1024" type="button">
            <span class="aspect-ratio-label">9:16</span>
            <span class="aspect-dim">576×1024</span>
          </button>
          <button class="aspect-btn" data-w="1024" data-h="768" type="button">
            <span class="aspect-ratio-label">4:3</span>
            <span class="aspect-dim">1024×768</span>
          </button>
        </div>
      </div>

      <!-- Generate Button -->
      <button id="generateBtn" class="generate-btn" type="button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        <span id="btnText">Generate with FLUX.2 Klein</span>
      </button>
    </div>

    <!-- Right Column: Result Display -->
    <div class="result-container">
      <div class="result-header">
        <div class="result-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Generated Output
        </div>
        <div id="statusBadge" class="status-badge">Completed in 1.4s</div>
      </div>

      <div class="image-stage" id="imageStage">
        <!-- Initial Placeholder -->
        <div id="stagePlaceholder" class="stage-placeholder">
          <div class="placeholder-art">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div>
            <h3 style="font-weight: 700; margin-bottom: 0.25rem; color: #f8fafc;">Ready to Create</h3>
            <p style="font-size: 0.8125rem;">Enter a prompt or upload reference images to generate with ultra-fast FLUX.2 Klein 4B.</p>
          </div>
        </div>

        <!-- Rendered Image -->
        <img id="outputImg" class="output-image" alt="FLUX.2 Klein output">

        <!-- Loading State -->
        <div id="loaderOverlay" class="loader-overlay">
          <div class="spinner"></div>
          <div class="loader-title">Distilling image with FLUX.2 Klein...</div>
          <div class="loader-subtitle" id="timerText">Elapsed: 0.0s (4 inference steps)</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div id="resultActions" class="result-actions">
        <a id="downloadBtn" download="flux2-klein-creation.jpg" class="action-btn btn-primary-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Image
        </a>
        <button id="useAsRefBtn" class="action-btn" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Use as Reference
        </button>
        <button id="copyBtn" class="action-btn" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy Data URL
        </button>
      </div>
    </div>
  </main>

  <!-- Modal: API Docs & cURL -->
  <div id="apiModal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">Programmatic API & cURL Usage</div>
        <button id="closeApiModal" class="modal-close">&times;</button>
      </div>
      <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">
        You can call this Worker endpoint directly using HTTP POST with either <code>multipart/form-data</code> or <code>application/json</code>.
      </p>

      <h4 style="font-size: 0.875rem; font-weight: 700; color: #a5b4fc; margin-top: 1rem;">1. Text to Image (cURL)</h4>
      <pre><code>curl -X POST https://YOUR_WORKER_URL/api/generate \\
  -F "prompt=cyberpunk cat in neon Tokyo" \\
  -F "width=1024" \\
  -F "height=1024" \\
  --output result.jpg</code></pre>

      <h4 style="font-size: 0.875rem; font-weight: 700; color: #a5b4fc; margin-top: 1.25rem;">2. Image Edit with Reference Upload (cURL)</h4>
      <pre><code>curl -X POST https://YOUR_WORKER_URL/api/generate \\
  -F "prompt=Place the subject from input_image_0 into a snowy mountain landscape" \\
  -F "input_image_0=@portrait.jpg" \\
  -F "width=1024" \\
  -F "height=1024" \\
  --output edited.jpg</code></pre>

      <h4 style="font-size: 0.875rem; font-weight: 700; color: #a5b4fc; margin-top: 1.25rem;">3. Fetch via JavaScript / JSON</h4>
      <pre><code>const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Cyberpunk neon city",
    width: 1024,
    height: 1024
  })
});
const data = await res.json();
console.log(data.image); // data:image/jpeg;base64,...</code></pre>
    </div>
  </div>

  <footer>
    Powered by <a href="https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/" target="_blank">Cloudflare Workers AI</a> &amp; Black Forest Labs FLUX.2 [klein] 4B.
  </footer>

  <script>
    (() => {
      // State
      let activeMode = "t2i";
      let selectedW = 1024;
      let selectedH = 1024;
      let referenceFiles = [null, null, null, null];
      let currentResultBase64 = null;
      let timerInterval = null;
      let startTime = 0;

      // DOM Elements
      const tabT2I = document.getElementById("tabT2I");
      const tabI2I = document.getElementById("tabI2I");
      const referenceSection = document.getElementById("referenceSection");
      const promptInput = document.getElementById("promptInput");
      const presetChips = document.getElementById("presetChips");
      const surpriseBtn = document.getElementById("surpriseBtn");
      const aspectBtns = document.querySelectorAll(".aspect-btn");
      const generateBtn = document.getElementById("generateBtn");
      const btnText = document.getElementById("btnText");
      const loaderOverlay = document.getElementById("loaderOverlay");
      const timerText = document.getElementById("timerText");
      const stagePlaceholder = document.getElementById("stagePlaceholder");
      const outputImg = document.getElementById("outputImg");
      const statusBadge = document.getElementById("statusBadge");
      const resultActions = document.getElementById("resultActions");
      const downloadBtn = document.getElementById("downloadBtn");
      const useAsRefBtn = document.getElementById("useAsRefBtn");
      const copyBtn = document.getElementById("copyBtn");
      const apiModal = document.getElementById("apiModal");
      const openApiModal = document.getElementById("openApiModal");
      const closeApiModal = document.getElementById("closeApiModal");

      // Presets
      const t2iPresets = [
        "Cyberpunk cat in neon Tokyo alleyway",
        "Hyper-realistic futuristic mech in pouring rain, cinematic",
        "Ethereal woodland creature in glowing mushroom forest",
        "Minimalist architectural pavilion over calm turquoise water",
        "Vintage 1970s retro space explorer poster"
      ];

      const i2iPresets = [
        "Transform input_image_0 into a vintage oil painting on textured canvas",
        "Give the subject of input_image_0 futuristic neon sunglasses and a leather jacket",
        "Place the object from input_image_0 onto a luxury marble studio podium",
        "Change the lighting in input_image_0 to golden hour dramatic sunset",
        "Style input_image_0 like a Studio Ghibli anime scene with watercolor skies"
      ];

      function renderPresets() {
        const list = activeMode === "t2i" ? t2iPresets : i2iPresets;
        presetChips.innerHTML = "";
        list.forEach(p => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "chip";
          chip.textContent = p;
          chip.addEventListener("click", () => {
            promptInput.value = p;
          });
          presetChips.appendChild(chip);
        });
      }

      function switchMode(mode) {
        activeMode = mode;
        if (mode === "t2i") {
          tabT2I.classList.add("active");
          tabI2I.classList.remove("active");
          referenceSection.style.display = "none";
          btnText.textContent = "Generate with FLUX.2 Klein";
        } else {
          tabI2I.classList.add("active");
          tabT2I.classList.remove("active");
          referenceSection.style.display = "flex";
          btnText.textContent = "Edit / Generate with References";
          if (!promptInput.value.includes("input_image_0")) {
            promptInput.value = "Transform input_image_0 into a vibrant cyberpunk digital artwork";
          }
        }
        renderPresets();
      }

      tabT2I.addEventListener("click", () => switchMode("t2i"));
      tabI2I.addEventListener("click", () => switchMode("i2i"));
      renderPresets();

      surpriseBtn.addEventListener("click", () => {
        const list = activeMode === "t2i" ? t2iPresets : i2iPresets;
        const random = list[Math.floor(Math.random() * list.length)];
        promptInput.value = random;
      });

      // Aspect Ratio Selection
      aspectBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          aspectBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedW = parseInt(btn.dataset.w, 10);
          selectedH = parseInt(btn.dataset.h, 10);
        });
      });

      // Image Reference Slots handling
      async function resizeImageIfNeeded(file) {
        // FLUX.2 Klein reference images are optimized at 512x512
        return new Promise((resolve) => {
          const img = new Image();
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
              const maxDim = 512;
              let w = img.width;
              let h = img.height;
              if (w <= maxDim && h <= maxDim) {
                resolve(file);
                return;
              }
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
              const canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, w, h);
              canvas.toBlob((blob) => {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              }, "image/jpeg", 0.9);
            };
          };
          reader.readAsDataURL(file);
        });
      }

      function setupSlot(slotIndex) {
        const slotEl = document.getElementById("slot-" + slotIndex);
        const fileInput = slotEl.querySelector(".hidden-file-input");
        const removeBtn = slotEl.querySelector(".remove-btn");

        slotEl.addEventListener("click", (e) => {
          if (e.target.closest(".remove-btn")) return;
          fileInput.click();
        });

        fileInput.addEventListener("change", async () => {
          if (fileInput.files && fileInput.files[0]) {
            await handleFile(slotIndex, fileInput.files[0]);
          }
        });

        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          clearSlot(slotIndex);
        });

        // Drag & drop
        slotEl.addEventListener("dragover", (e) => {
          e.preventDefault();
          slotEl.classList.add("dragover");
        });
        slotEl.addEventListener("dragleave", () => {
          slotEl.classList.remove("dragover");
        });
        slotEl.addEventListener("drop", async (e) => {
          e.preventDefault();
          slotEl.classList.remove("dragover");
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFile(slotIndex, e.dataTransfer.files[0]);
          }
        });
      }

      async function handleFile(slotIndex, file) {
        const slotEl = document.getElementById("slot-" + slotIndex);
        const optimizedFile = await resizeImageIfNeeded(file);
        referenceFiles[slotIndex] = optimizedFile;

        let img = slotEl.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          slotEl.appendChild(img);
        }
        img.src = URL.createObjectURL(optimizedFile);
        slotEl.classList.add("has-image");

        // If currently in T2I, switch to I2I automatically so reference is active
        if (activeMode === "t2i") {
          switchMode("i2i");
        }
      }

      function clearSlot(slotIndex) {
        referenceFiles[slotIndex] = null;
        const slotEl = document.getElementById("slot-" + slotIndex);
        const img = slotEl.querySelector("img");
        if (img) img.remove();
        slotEl.classList.remove("has-image");
        const fileInput = slotEl.querySelector(".hidden-file-input");
        fileInput.value = "";
      }

      for (let i = 0; i < 4; i++) {
        setupSlot(i);
      }

      // Generate Execution
      async function runGeneration() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
          alert("Please enter a prompt!");
          return;
        }

        // Start UI state
        generateBtn.disabled = true;
        loaderOverlay.style.display = "flex";
        startTime = Date.now();
        timerInterval = setInterval(() => {
          const sec = ((Date.now() - startTime) / 1000).toFixed(1);
          timerText.textContent = "Elapsed: " + sec + "s (4 inference steps)";
        }, 100);

        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("width", selectedW.toString());
        formData.append("height", selectedH.toString());

        // Append references if in reference mode
        if (activeMode === "i2i") {
          for (let i = 0; i < 4; i++) {
            if (referenceFiles[i]) {
              formData.append("input_image_" + i, referenceFiles[i]);
            }
          }
        }

        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            body: formData,
            headers: {
              "Accept": "application/json"
            }
          });

          clearInterval(timerInterval);
          const totalSec = ((Date.now() - startTime) / 1000).toFixed(2);

          if (!res.ok) {
            const errData = await res.json().catch(() => ({ error: "Generation failed" }));
            throw new Error(errData.error || ("Server error: " + res.status));
          }

          const data = await res.json();
          if (!data.image) {
            throw new Error("No image data returned from model");
          }

          currentResultBase64 = data.image;

          // Render Image
          outputImg.src = data.image;
          outputImg.style.display = "block";
          stagePlaceholder.style.display = "none";
          resultActions.style.display = "flex";

          statusBadge.textContent = "Generated in " + totalSec + "s";
          statusBadge.style.display = "inline-block";

          downloadBtn.href = data.image;
        } catch (err) {
          clearInterval(timerInterval);
          alert("Error: " + err.message);
        } finally {
          generateBtn.disabled = false;
          loaderOverlay.style.display = "none";
        }
      }

      generateBtn.addEventListener("click", runGeneration);

      // Keyboard shortcut Ctrl/Cmd + Enter to generate
      document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          runGeneration();
        }
      });

      // "Use as Reference" button: take generated image and load into Slot 0!
      useAsRefBtn.addEventListener("click", async () => {
        if (!currentResultBase64) return;
        const res = await fetch(currentResultBase64);
        const blob = await res.blob();
        const file = new File([blob], "generated_reference.jpg", { type: "image/jpeg" });
        await handleFile(0, file);
        switchMode("i2i");
        promptInput.value = "Modify input_image_0: ";
        promptInput.focus();
      });

      // Copy Base64
      copyBtn.addEventListener("click", async () => {
        if (!currentResultBase64) return;
        try {
          await navigator.clipboard.writeText(currentResultBase64);
          copyBtn.textContent = "Copied Data URL!";
          setTimeout(() => {
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Data URL';
          }, 2000);
        } catch {
          alert("Clipboard copy failed");
        }
      });

      // Modal handlers
      openApiModal.addEventListener("click", () => { apiModal.style.display = "flex"; });
      closeApiModal.addEventListener("click", () => { apiModal.style.display = "none"; });
      apiModal.addEventListener("click", (e) => {
        if (e.target === apiModal) apiModal.style.display = "none";
      });
    })();
  </script>
</body>
</html>`;
}
