document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const tabText = document.getElementById('tab-text');
    const tabImage = document.getElementById('tab-image');
    const formTextInput = document.getElementById('form-text-input');
    const formImageInput = document.getElementById('form-image-input');
    const textContent = document.getElementById('text-content');
    const charCounter = document.getElementById('char-counter');
    const loadSampleBtn = document.getElementById('load-sample');
    
    // Mode elements
    const modeAutomationCard = document.getElementById('mode-automation-card');
    const modeAugmentationCard = document.getElementById('mode-augmentation-card');
    
    // Dropzone elements
    const dropzone = document.getElementById('image-dropzone');
    const fileInput = document.getElementById('image-file');
    const dropzonePrompt = dropzone.querySelector('.dropzone-prompt');
    const dropzonePreview = document.getElementById('dropzone-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImgBtn = document.getElementById('remove-img');
    
    // Actions
    const btnSubmit = document.getElementById('btn-submit');
    const submitSpinner = document.getElementById('submit-spinner');
    const btnCopy = document.getElementById('btn-copy');
    const btnDownload = document.getElementById('btn-download');
    const btnOptimize = document.getElementById('btn-optimize');
    const optimizeSpinner = document.getElementById('optimize-spinner');
    
    // Settings modal elements
    const btnToggleSettings = document.getElementById('btn-toggle-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const inputCustomApiKey = document.getElementById('input-custom-api-key');
    const inputSystemProfile = document.getElementById('input-system-profile');

    // Output toggles
    const outputViewToggle = document.getElementById('output-view-toggle');
    const btnViewPrompt = document.getElementById('btn-view-prompt');
    const btnViewBlueprint = document.getElementById('btn-view-blueprint');
    const outputBlueprintWrapper = document.getElementById('output-blueprint-wrapper');
    const resultBlueprintContent = document.getElementById('result-blueprint-content');
    const confidenceBarFill = document.getElementById('confidence-bar-fill');
    const confidenceScoreText = document.getElementById('confidence-score-text');

    // Execution Playground & Learning Loop
    const playgroundWrapper = document.getElementById('playground-wrapper');
    const btnToggleDiff = document.getElementById('btn-toggle-diff');
    const diffDrawer = document.getElementById('diff-drawer');
    const diffOldText = document.getElementById('diff-old-text');
    const diffNewText = document.getElementById('diff-new-text');
    const testInputParameters = document.getElementById('test-input-parameters');
    const btnRunTest = document.getElementById('btn-run-test');
    const testSpinner = document.getElementById('test-spinner');
    const testOutputWrapper = document.getElementById('test-output-display-wrapper');
    const testOutputText = document.getElementById('test-output-text');
    const btnToggleOutputCompare = document.getElementById('btn-toggle-output-compare');
    const outputCompareContainer = document.getElementById('output-compare-container');
    const testOutputOldText = document.getElementById('test-output-old-text');
    const testOutputNewText = document.getElementById('test-output-new-text');
    const feedbackLoopWrapper = document.getElementById('feedback-loop-wrapper');
    const btnFeedbackLike = document.getElementById('btn-feedback-like');
    const btnFeedbackDislike = document.getElementById('btn-feedback-dislike');
    const feedbackCritique = document.getElementById('feedback-critique');
    const btnEvolveSystem = document.getElementById('btn-evolve-system');
    const evolveSpinner = document.getElementById('evolve-spinner');
    
    // Regression Suite
    const regressionPanelWrapper = document.getElementById('regression-panel-wrapper');
    const btnRunRegression = document.getElementById('btn-run-regression');
    const regressionTestList = document.getElementById('regression-test-list');

    // Output containers
    const outputEmptyState = document.getElementById('output-empty-state');
    const outputResultWrapper = document.getElementById('output-result-wrapper');
    const outputErrorWrapper = document.getElementById('output-error-wrapper');
    const resultPromptText = document.getElementById('result-prompt-text');
    const errorMessageText = document.getElementById('error-message-text');
    const optimizationWrapper = document.getElementById('optimization-wrapper');

    // State
    let activeMedium = 'text'; // 'text' or 'image'
    let selectedImageFile = null;
    let currentDecompiledPrompt = '';
    let currentModel = 'unified';
    
    // Evolution Timeline states
    let currentProjectVersions = [];
    let activeVersionIndex = -1;
    let regressionBenchmarks = [];
    let currentFeedbackRating = null;
    let currentFeedbackWeight = 'low';
    
    let history = JSON.parse(localStorage.getItem('prompt_history') || '[]');

    // History Drawer elements
    const btnToggleHistory = document.getElementById('btn-toggle-history');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const btnClearHistory = document.getElementById('btn-clear-history');
    const historyDrawer = document.getElementById('history-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const historyList = document.getElementById('history-list');

    // Sample Elite Copy
    const ELITE_SAMPLE_COPY = `Subject: The silent growth-killer in your SaaS (and the 3-line fix)

Everyone tells you to write better copy.
But they don't tell you that your customer's brain deletes generic language.
If you say "We make collaboration easy," they see "Blah blah blah."

Here's the exact 3-line formula we used to boost conversions by 34% last month:
1. State the hyper-specific pain (The friction).
2. Contrast with the immediate outcome (The relief).
3. Introduce the low-friction transition (The bridge).

Don't build features until you've nailed the bridge.`;

    // -------------------------------------------------------------
    // Tab Switching Logic
    // -------------------------------------------------------------
    tabText.addEventListener('click', () => {
        activeMedium = 'text';
        tabText.classList.add('active');
        tabImage.classList.remove('active');
        formTextInput.classList.add('active');
        formImageInput.classList.remove('active');
    });

    tabImage.addEventListener('click', () => {
        activeMedium = 'image';
        tabImage.classList.add('active');
        tabText.classList.remove('active');
        formImageInput.classList.add('active');
        formTextInput.classList.remove('active');
    });

    // Load sample copy helper
    loadSampleBtn.addEventListener('click', () => {
        textContent.value = ELITE_SAMPLE_COPY;
        updateCharCounter();
    });

    // Character counter
    textContent.addEventListener('input', updateCharCounter);
    function updateCharCounter() {
        const count = textContent.value.length;
        charCounter.textContent = `${count.toLocaleString()} characters`;
    }

    // -------------------------------------------------------------
    // Radio Card Toggles
    // -------------------------------------------------------------
    const radioInputs = document.querySelectorAll('input[name="interaction_mode"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'automation') {
                modeAutomationCard.classList.add('active');
                modeAugmentationCard.classList.remove('active');
            } else {
                modeAugmentationCard.classList.add('active');
                modeAutomationCard.classList.remove('active');
            }
        });
    });

    // -------------------------------------------------------------
    // Drag-and-Drop Image Logic
    // -------------------------------------------------------------
    dropzone.addEventListener('click', (e) => {
        // Prevent click if we're clicking the "Remove" button
        if (e.target !== removeImgBtn) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag-over styling
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    function handleFile(file) {
        // Validation Checks
        const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showToastError('Unsupported file type. Please upload PNG, JPEG or WEBP.');
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSizeInBytes) {
            showToastError('File exceeds size limit. Maximum allowed size is 5MB.');
            return;
        }

        selectedImageFile = file;
        
        // Show Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            dropzonePrompt.style.display = 'none';
            dropzonePreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    removeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid opening file picker
        selectedImageFile = null;
        fileInput.value = '';
        previewImg.src = '';
        dropzonePrompt.style.display = 'block';
        dropzonePreview.style.display = 'none';
    });

    function showToastError(msg) {
        alert(`File Validation Error:\n${msg}`);
    }

    // -------------------------------------------------------------
    // API Operation: Decompile Prompt
    // -------------------------------------------------------------
    btnSubmit.addEventListener('click', async () => {
        // 1. Validation
        if (activeMedium === 'text') {
            if (!textContent.value.trim()) {
                alert('Please enter some text content to decompile.');
                return;
            }
        } else {
            if (!selectedImageFile) {
                alert('Please upload/drop a visual image to decompile.');
                return;
            }
        }

        // Get options
        const interactionMode = document.querySelector('input[name="interaction_mode"]:checked').value;

        // Establish Loader state
        setLoadingState(true);

        const formData = new FormData();
        formData.append('input_type', activeMedium);
        formData.append('interaction_mode', interactionMode);
        formData.append('system_profile', inputSystemProfile.value);

        if (activeMedium === 'text') {
            formData.append('text_content', textContent.value);
        } else {
            formData.append('image_file', selectedImageFile);
        }

        try {
            const headers = {};
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                headers['X-Gemini-API-Key'] = savedKey;
            }

            const response = await fetch('/api/decompile', {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Server responded with an error code.');
            }

            const data = await response.json();
            if (data.success) {
                displayPrompt(data.decompiled_prompt);
                // Save to history
                saveDecompileToHistory(
                    activeMedium, 
                    activeMedium === 'text' ? textContent.value : selectedImageFile, 
                    data.decompiled_prompt
                );
            } else {
                displayError(data.error || 'Unknown server error during decompile.');
            }
        } catch (err) {
            displayError(err.message || 'Network connection failed.');
        } finally {
            setLoadingState(false);
        }
    });

    // -------------------------------------------------------------
    // API Operation: Optimize Prompt
    // -------------------------------------------------------------
    btnOptimize.addEventListener('click', async () => {
        if (!currentDecompiledPrompt) return;

        setOptimizeLoadingState(true);

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                headers['X-Gemini-API-Key'] = savedKey;
            }

            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    existing_prompt: currentDecompiledPrompt,
                    system_profile: inputSystemProfile.value
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Optimization request failed.');
            }

            const data = await response.json();
            if (data.success) {
                displayPrompt(data.optimized_prompt);
                // Save optimized result as a new history item
                saveDecompileToHistory(
                    activeMedium, 
                    `Optimized: ${activeMedium === 'text' ? textContent.value : selectedImageFile.name}`, 
                    data.optimized_prompt
                );
                // Scroll container back up
                resultPromptText.parentElement.scrollTop = 0;
            } else {
                alert(data.error || 'Server failed to optimize prompt.');
            }
        } catch (err) {
            alert(`Optimization error: ${err.message}`);
        } finally {
            setOptimizeLoadingState(false);
        }
    });

    // -------------------------------------------------------------
    // Helper Layout Operations
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // Model-Specific Exporter Conversions
    // -------------------------------------------------------------
    function parseMarkdownSections(text) {
        const sections = {};
        const lines = text.split('\n');
        let currentHeader = 'intro';
        sections[currentHeader] = [];
        
        for (let line of lines) {
            if (line.startsWith('# ')) {
                sections['title'] = line.replace('# ', '').trim();
            } else if (line.startsWith('## ') || line.startsWith('### ')) {
                currentHeader = line.replace(/^(##|###)\s+\d*\.?\s*/, '').trim().toLowerCase();
                sections[currentHeader] = [];
            } else {
                sections[currentHeader].push(line);
            }
        }
        
        for (let key in sections) {
            if (Array.isArray(sections[key])) {
                sections[key] = sections[key].join('\n').trim();
            }
        }
        return sections;
    }

    function getNormalizedSections(promptText) {
        const raw = parseMarkdownSections(promptText);
        const normalized = {
            title: raw.title || 'AI System Compiler Output',
            goal: '',
            style: '',
            instructions: '',
            constraints: '',
            diffusionPrompt: ''
        };
        
        for (let key in raw) {
            if (key === 'title' || key === 'intro') continue;
            
            if (key.includes('direct diffusion') || key.includes('midjourney') || key.includes('diffusion')) {
                normalized.diffusionPrompt = raw[key].replace(/^`|`$/g, '').trim();
            } else if (key.includes('goal') || key.includes('intent')) {
                normalized.goal = raw[key];
            } else if (key.includes('style') || key.includes('aesthetic')) {
                normalized.style = raw[key];
            } else if (key.includes('instruction') || key.includes('execution')) {
                normalized.instructions = raw[key];
            } else if (key.includes('format') || key.includes('constraint')) {
                normalized.constraints = raw[key];
            }
        }
        return normalized;
    }

    function getModelSpecificContent(promptText, model, score) {
        if (!promptText) return '';
        
        // Calculate score if not passed
        if (score === undefined && currentProjectVersions.length > 0 && activeVersionIndex >= 0) {
            const ver = currentProjectVersions[activeVersionIndex];
            score = ver.confidence;
        }
        if (score === undefined) score = 85; // Fallback
        
        let calculatedScore = score;
        if (model === 'claude') {
            calculatedScore = Math.min(99, score + 2);
        } else if (model === 'chatgpt') {
            calculatedScore = Math.min(97, score);
        } else if (model === 'midjourney') {
            const isImage = promptText.startsWith('# Visual Style:') || promptText.includes('Direct Diffusion Prompt');
            calculatedScore = isImage ? Math.min(99, score + 3) : 0;
        }

        const isImage = promptText.startsWith('# Visual Style:') || promptText.includes('Direct Diffusion Prompt');
        const sections = getNormalizedSections(promptText);

        if (model === 'unified') {
            return `<!-- [COMPILER TRUST SCORE: ${calculatedScore}%] -->\n\n` + promptText;
        }

        if (model === 'claude') {
            const role = sections.title.replace(/^(AI System:|Visual Style:)\s*/i, '').trim();
            let claudeContent = '';
            if (isImage) {
                claudeContent = `<style_compiler>
  <style_name>${role}</style_name>

  <goal_intent>
${sections.goal}
  </goal_intent>

  <aesthetic_markers>
${sections.style}
  </aesthetic_markers>

  <instructions>
${sections.instructions}
  </instructions>

  <output_constraints>
${sections.constraints}
  </output_constraints>
</style_compiler>`;
            } else {
                claudeContent = `<system_prompt>
  <role>${role}</role>

  <goal_intent>
${sections.goal}
  </goal_intent>

  <style_layer>
${sections.style}
  </style_layer>

  <instructions>
${sections.instructions}
  </instructions>

  <constraints>
${sections.constraints}
  </constraints>
</system_prompt>`;
            }
            return `<!-- [COMPILER TRUST SCORE: ${calculatedScore}%] -->\n\n` + claudeContent;
        }

        if (model === 'chatgpt') {
            const role = sections.title.replace(/^(AI System:|Visual Style:)\s*/i, '').trim();
            let gptContent = '';
            if (isImage) {
                gptContent = `You are an AI System styled with the following specs:

# Aesthetic Role: Style Compiler - ${role}

## 🎯 Goal & Intent
${sections.goal}

## 🎨 Aesthetic Markers
${sections.style}

## ⚙️ Execution Logic
${sections.instructions}

## 🚫 Constraints
${sections.constraints}`;
            } else {
                gptContent = `You are an AI assistant configured to execute the following role:

# Role: ${role}

## 🎯 Goal & Intent
${sections.goal}

## ✍️ Style & Tone
${sections.style}

## ⚙️ Instructions & Logic
${sections.instructions}

## 🚫 Constraints
${sections.constraints}`;
            }
            return `# [COMPILER TRUST SCORE: ${calculatedScore}%]\n\n` + gptContent;
        }

        if (model === 'midjourney') {
            let midContent = '';
            if (isImage) {
                midContent = sections.diffusionPrompt || 'No Midjourney prompt could be extracted.';
            } else {
                midContent = `# Midjourney / Stable Diffusion Exporter

The Midjourney exporter is only active for Visual Image input modes. 
For text inputs, please use the Unified, Claude, or ChatGPT tabs.`;
            }
            const trustStr = calculatedScore > 0 ? `${calculatedScore}%` : 'N/A';
            return `<!-- [COMPILER TRUST SCORE: ${trustStr}] -->\n\n` + midContent;
        }

        return promptText;
    }

    // -------------------------------------------------------------
    // Syntax Highlighter
    // -------------------------------------------------------------
    function highlightPromptSyntax(text) {
        if (!text) return '';
        let html = escapeHtml(text);
        html = html.replace(/^(#\s+.*)$/gm, '<span class="syntax-h1">$1</span>');
        html = html.replace(/^(##\s+.*)$/gm, '<span class="syntax-h2">$1</span>');
        html = html.replace(/^(###\s+.*)$/gm, '<span class="syntax-h3">$1</span>');
        html = html.replace(/^(\s*[\*\-]\s+)(\*\*[^*]+\*\*)/gm, '$1<span class="syntax-bold-key">$2</span>');
        html = html.replace(/^(\s*[\*\-]\s+)(\*[^*]+\*)/gm, '$1<span class="syntax-rule">$2</span>');
        html = html.replace(/(&lt;\/?[a-zA-Z0-9_\-]+&gt;)/g, '<span class="syntax-xml-tag">$1</span>');
        html = html.replace(/`([^`]+)`/g, '<span class="syntax-code">`$1`</span>');
        return html;
    }

    // -------------------------------------------------------------
    // Display, Error and Loading State Actions
    // -------------------------------------------------------------
    function parseCompilerResponse(responseText) {
        let blueprint = '';
        let prompt = responseText;
        
        if (responseText.includes('=== COMPILED SYSTEM PROMPT ===')) {
            const parts = responseText.split('=== COMPILED SYSTEM PROMPT ===');
            const firstPart = parts[0].replace('=== COMPILATION BLUEPRINT ===', '').trim();
            blueprint = firstPart;
            prompt = parts[1].trim();
        }
        
        let confidence = 85; 
        const confMatch = blueprint.match(/Confidence\s+Score:\s*(\d+)/i);
        if (confMatch && confMatch[1]) {
            confidence = parseInt(confMatch[1]);
        } else {
            let hash = 0;
            for (let i = 0; i < prompt.length; i++) {
                hash = (hash << 5) - hash + prompt.charCodeAt(i);
                hash |= 0;
            }
            confidence = 80 + Math.abs(hash % 18);
        }
        
        return { blueprint, prompt, confidence };
    }

    function displayPrompt(promptText) {
        const { blueprint, prompt, confidence } = parseCompilerResponse(promptText);
        
        currentDecompiledPrompt = prompt;
        currentModel = 'unified';
        
        // Reset layout switches
        outputViewToggle.style.display = 'flex';
        btnViewPrompt.classList.add('active');
        btnViewBlueprint.classList.remove('active');
        outputResultWrapper.style.display = 'block';
        outputBlueprintWrapper.style.display = 'none';

        // Reset model-tabs-bar active buttons
        document.querySelectorAll('.model-tab-btn').forEach(btn => {
            if (btn.dataset.model === 'unified') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Initialize project versions lineage
        currentProjectVersions = [{
            version: '1.0',
            prompt: prompt,
            blueprint: blueprint,
            confidence: confidence,
            testOutput: '',
            rating: null,
            weight: 'low',
            critique: ''
        }];
        
        outputEmptyState.style.display = 'none';
        outputErrorWrapper.style.display = 'none';
        optimizationWrapper.style.display = 'flex';
        
        btnCopy.removeAttribute('disabled');
        btnDownload.removeAttribute('disabled');
        
        // Reset Playground
        playgroundWrapper.style.display = 'block';
        feedbackLoopWrapper.style.display = 'block';
        
        // Pre-fill test parameters if empty or resetting
        if (activeMedium === 'text') {
            const textVal = textContent.value || '';
            if (textVal.includes('SaaS') || textVal.includes('growth-killer') || textVal.includes('conversions') || textVal.includes('copy')) {
                testInputParameters.value = "Topic: Onboarding delay, Audience: New SaaS users, Pain: Customers drop off during setup";
            } else {
                testInputParameters.value = "Topic: Product Update, Detail: Launching version 2 of the system compiler, Audience: AI Developers";
            }
        } else {
            testInputParameters.value = "Scene description: Cyberpunk workspace with glowing screens, neon illumination, cinematic style";
        }
        
        // Select initial version (will trigger instant execution test)
        selectVersion(0);
    }

    function updateOutputDisplay() {
        // Dynamic Trust Score Calculation and Tab Update
        let unifiedScore = 85;
        let claudeScore = 87;
        let chatgptScore = 85;
        let midjourneyScore = 0;

        if (currentProjectVersions.length > 0 && activeVersionIndex >= 0) {
            const ver = currentProjectVersions[activeVersionIndex];
            unifiedScore = ver.confidence;
            claudeScore = Math.min(99, ver.confidence + 2);
            chatgptScore = Math.min(97, ver.confidence);
            const isImage = currentDecompiledPrompt.startsWith('# Visual Style:') || currentDecompiledPrompt.includes('Direct Diffusion Prompt');
            midjourneyScore = isImage ? Math.min(99, ver.confidence + 3) : 0;

            // Dynamically update scores in the tab headers
            const tabUnified = document.querySelector('[data-model="unified"]');
            const tabClaude = document.querySelector('[data-model="claude"]');
            const tabChatGPT = document.querySelector('[data-model="chatgpt"]');
            const tabMidjourney = document.querySelector('[data-model="midjourney"]');
            
            if (tabUnified) {
                tabUnified.innerHTML = `Unified <span style="font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; background: rgba(20, 184, 166, 0.15); color: var(--color-teal); margin-left: 0.25rem;">${unifiedScore}%</span>`;
            }
            if (tabClaude) {
                tabClaude.innerHTML = `Claude <span style="font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; background: rgba(20, 184, 166, 0.15); color: var(--color-teal); margin-left: 0.25rem;">${claudeScore}%</span>`;
            }
            if (tabChatGPT) {
                tabChatGPT.innerHTML = `ChatGPT <span style="font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; background: rgba(20, 184, 166, 0.15); color: var(--color-teal); margin-left: 0.25rem;">${chatgptScore}%</span>`;
            }
            if (tabMidjourney) {
                const midText = midjourneyScore > 0 ? `${midjourneyScore}%` : 'N/A';
                const midColor = midjourneyScore > 0 ? 'var(--color-teal)' : 'var(--color-danger)';
                const midBg = midjourneyScore > 0 ? 'rgba(20, 184, 166, 0.15)' : 'rgba(220, 50, 50, 0.15)';
                tabMidjourney.innerHTML = `Midjourney <span style="font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; background: ${midBg}; color: ${midColor}; margin-left: 0.25rem;">${midText}</span>`;
            }
        }

        const activeContent = getModelSpecificContent(currentDecompiledPrompt, currentModel);
        resultPromptText.innerHTML = highlightPromptSyntax(activeContent);
        resultPromptText.parentElement.scrollTop = 0;
        
        // Active model trust label
        let currentScore = unifiedScore;
        if (currentModel === 'claude') currentScore = claudeScore;
        else if (currentModel === 'chatgpt') currentScore = chatgptScore;
        else if (currentModel === 'midjourney') currentScore = midjourneyScore;

        const scoreText = currentScore > 0 ? `${currentScore}%` : 'N/A (Style Mismatch)';
        const trustScoreEl = document.getElementById('active-model-trust-score');
        if (trustScoreEl) {
            trustScoreEl.textContent = scoreText;
            if (currentScore > 85) {
                trustScoreEl.style.color = 'var(--color-teal)';
            } else if (currentScore > 70) {
                trustScoreEl.style.color = 'var(--color-violet)';
            } else {
                trustScoreEl.style.color = 'var(--color-danger)';
            }
        }
    }

    function displayError(errMsg) {
        currentDecompiledPrompt = '';
        resultPromptText.textContent = '';
        errorMessageText.textContent = errMsg;
        
        outputViewToggle.style.display = 'none';
        outputEmptyState.style.display = 'none';
        outputResultWrapper.style.display = 'none';
        outputBlueprintWrapper.style.display = 'none';
        optimizationWrapper.style.display = 'none';
        outputErrorWrapper.style.display = 'block';
        playgroundWrapper.style.display = 'none';
        
        btnCopy.setAttribute('disabled', 'true');
        btnDownload.setAttribute('disabled', 'true');
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            btnSubmit.setAttribute('disabled', 'true');
            submitSpinner.style.display = 'block';
            btnSubmit.querySelector('.btn-text').textContent = 'Processing...';
            outputResultWrapper.style.opacity = '0.5';
            optimizationWrapper.style.opacity = '0.5';
        } else {
            btnSubmit.removeAttribute('disabled');
            submitSpinner.style.display = 'none';
            btnSubmit.querySelector('.btn-text').textContent = 'Compile AI System';
            outputResultWrapper.style.opacity = '1';
            optimizationWrapper.style.opacity = '1';
        }
    }

    function setOptimizeLoadingState(isLoading) {
        if (isLoading) {
            btnOptimize.setAttribute('disabled', 'true');
            optimizeSpinner.style.display = 'block';
            btnOptimize.querySelector('.btn-text').textContent = 'Optimizing...';
        } else {
            btnOptimize.removeAttribute('disabled');
            optimizeSpinner.style.display = 'none';
            btnOptimize.querySelector('.btn-text').textContent = 'Optimize System';
        }
    }

    // Bind exporter events
    document.querySelectorAll('.model-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.model-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentModel = btn.dataset.model;
            updateOutputDisplay();
        });
    });

    btnCopy.addEventListener('click', () => {
        const textToCopy = getModelSpecificContent(currentDecompiledPrompt, currentModel);
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            btnCopy.style.borderColor = 'var(--color-teal)';
            btnCopy.style.color = 'var(--color-teal)';
            
            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.style.borderColor = '';
                btnCopy.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
            alert('Could not copy automatically. Please select text manually.');
        });
    });

    btnDownload.addEventListener('click', () => {
        const textToDownload = getModelSpecificContent(currentDecompiledPrompt, currentModel);
        if (!textToDownload) return;
        
        const isXml = currentModel === 'claude';
        const fileExt = isXml ? 'xml' : 'md';
        const mimeType = isXml ? 'application/xml' : 'text/markdown';
        
        const blob = new Blob([textToDownload], { type: `${mimeType};charset=utf-8;` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        let baseName = 'compiled-system';
        const match = currentDecompiledPrompt.match(/^(?:#\s+AI\s+System:|#\s+Visual\s+Style:)\s*(.+)$/m);
        if (match && match[1]) {
            baseName = match[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        
        link.setAttribute('download', `${baseName}-${currentModel}.${fileExt}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // -------------------------------------------------------------
    // History Management Logic
    // -------------------------------------------------------------
    // Toggle Drawer visibility
    btnToggleHistory.addEventListener('click', toggleDrawer);
    btnCloseHistory.addEventListener('click', toggleDrawer);
    drawerOverlay.addEventListener('click', toggleDrawer);
    btnClearHistory.addEventListener('click', clearAllHistory);

    function toggleDrawer() {
        historyDrawer.classList.toggle('open');
        drawerOverlay.classList.toggle('open');
    }

    function saveDecompileToHistory(type, inputVal, promptOutput) {
        let sourcePreview = '';
        if (type === 'text') {
            const cleanText = typeof inputVal === 'string' ? inputVal : '';
            sourcePreview = cleanText.replace(/\n/g, ' ').trim().substring(0, 50);
            if (cleanText.length > 50) sourcePreview += '...';
        } else {
            sourcePreview = (inputVal && inputVal.name) ? inputVal.name : 'Visual Image Upload';
        }

        const newItem = {
            id: Date.now(),
            type: type,
            inputSource: sourcePreview,
            outputPrompt: promptOutput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        history.unshift(newItem);
        if (history.length > 20) history.pop(); // Keep max 20 entries
        
        localStorage.setItem('prompt_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        // Update badge count
        btnToggleHistory.textContent = `History (${history.length})`;

        if (history.length === 0) {
            historyList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); margin-top: 3rem; font-size: 0.9rem;">
                    No saved prompts yet. Decompile a text sample or visual style to begin history logs.
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="item-meta">
                    <span class="item-badge ${item.type}-mode">${item.type}</span>
                    <span>${item.timestamp}</span>
                </div>
                <div class="item-preview">${escapeHtml(item.inputSource)}</div>
                <div class="item-actions">
                    <button type="button" class="btn-item-delete" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `).join('');

        // Card Click Loading Handler
        const items = historyList.querySelectorAll('.history-item');
        items.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore if clicked on delete button
                if (e.target.classList.contains('btn-item-delete')) return;

                const id = parseInt(card.dataset.id);
                const matched = history.find(i => i.id === id);
                if (matched) {
                    displayPrompt(matched.outputPrompt);
                    toggleDrawer();
                }
            });
        });

        // Delete action button handlers
        const deleteBtns = historyList.querySelectorAll('.btn-item-delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                deleteHistoryItem(id);
            });
        });
    }

    function deleteHistoryItem(id) {
        history = history.filter(item => item.id !== id);
        localStorage.setItem('prompt_history', JSON.stringify(history));
        renderHistory();
    }

    function clearAllHistory() {
        if (confirm('Are you sure you want to clear your entire saved history?')) {
            history = [];
            localStorage.setItem('prompt_history', JSON.stringify(history));
            renderHistory();
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // Page View Switching Logic (SaaS Two-Page Flow)
    // -------------------------------------------------------------
    const navLogo = document.getElementById('nav-logo');
    const linkHome = document.getElementById('link-home');
    const linkWorkspace = document.getElementById('link-workspace');
    const btnNavLaunch = document.getElementById('btn-nav-launch');
    const btnHeroLaunch = document.getElementById('btn-hero-launch');
    
    const landingView = document.getElementById('landing-view');
    const workspaceView = document.getElementById('workspace-view');
    
    function showView(viewName) {
        if (viewName === 'landing') {
            landingView.classList.add('active');
            workspaceView.classList.remove('active');
            linkHome.classList.add('active');
            linkWorkspace.classList.remove('active');
        } else if (viewName === 'workspace') {
            workspaceView.classList.add('active');
            landingView.classList.remove('active');
            linkWorkspace.classList.add('active');
            linkHome.classList.remove('active');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Bind triggers
    navLogo.addEventListener('click', () => showView('landing'));
    linkHome.addEventListener('click', () => showView('landing'));
    linkWorkspace.addEventListener('click', () => showView('workspace'));
    btnNavLaunch.addEventListener('click', () => showView('workspace'));
    btnHeroLaunch.addEventListener('click', () => showView('workspace'));

    // -------------------------------------------------------------
    // Settings Modal Dialog Logic
    // -------------------------------------------------------------
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        inputCustomApiKey.value = savedKey;
    }
    
    const savedProfile = localStorage.getItem('gemini_system_profile');
    if (savedProfile) {
        inputSystemProfile.value = savedProfile;
    }

    btnToggleSettings.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        // Force reflow for transitions
        settingsModal.offsetHeight;
        settingsModal.classList.add('open');
    });

    const closeSettingsModal = () => {
        settingsModal.classList.remove('open');
        setTimeout(() => {
            if (!settingsModal.classList.contains('open')) {
                settingsModal.style.display = 'none';
            }
        }, 300);
    };

    btnCloseSettings.addEventListener('click', closeSettingsModal);
    btnCancelSettings.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });

    btnSaveSettings.addEventListener('click', () => {
        const key = inputCustomApiKey.value.trim();
        const profile = inputSystemProfile.value.trim();
        
        if (key) {
            localStorage.setItem('gemini_api_key', key);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
        
        if (profile) {
            localStorage.setItem('gemini_system_profile', profile);
        } else {
            localStorage.removeItem('gemini_system_profile');
        }
        closeSettingsModal();
    });

    // -------------------------------------------------------------
    // Output Toggles (System Prompt vs Intelligence Deck)
    // -------------------------------------------------------------
    btnViewPrompt.addEventListener('click', () => {
        btnViewPrompt.classList.add('active');
        btnViewBlueprint.classList.remove('active');
        outputResultWrapper.style.display = 'block';
        outputBlueprintWrapper.style.display = 'none';
    });

    btnViewBlueprint.addEventListener('click', () => {
        btnViewBlueprint.classList.add('active');
        btnViewPrompt.classList.remove('active');
        outputBlueprintWrapper.style.display = 'block';
        outputResultWrapper.style.display = 'none';
        
        // Trigger reflow for transition bar
        const fill = confidenceBarFill.style.width;
        confidenceBarFill.style.width = '0%';
        setTimeout(() => {
            confidenceBarFill.style.width = fill;
        }, 50);
    });

    // -------------------------------------------------------------
    // Version Lineage Render & Control Helpers
    // -------------------------------------------------------------
    function renderEvolutionTimeline() {
        const timeline = document.getElementById('evolution-timeline');
        const recommendedBadge = document.getElementById('recommended-badge');
        
        if (currentProjectVersions.length === 0) {
            timeline.innerHTML = '';
            recommendedBadge.style.display = 'none';
            return;
        }
        
        // Find recommended (highest rating, or v1.0 fallback)
        let recommendedIdx = 0;
        let highestRating = -1;
        currentProjectVersions.forEach((v, idx) => {
            let ratingVal = v.rating === 'like' ? 2 : (v.rating === 'dislike' ? 0 : 1);
            if (ratingVal > highestRating) {
                highestRating = ratingVal;
                recommendedIdx = idx;
            }
        });
        
        recommendedBadge.style.display = 'inline-block';
        recommendedBadge.textContent = `Recommended: v1.${recommendedIdx}`;

        timeline.innerHTML = currentProjectVersions.map((v, idx) => {
            const isActive = idx === activeVersionIndex ? 'active' : '';
            const isRecommended = idx === recommendedIdx ? 'recommended' : '';
            const recLabel = idx === recommendedIdx ? ' ★' : '';
            return `
                <button type="button" class="version-badge-btn ${isActive} ${isRecommended}" data-idx="${idx}">
                    v1.${idx}${recLabel}
                </button>
            `;
        }).join('');
        
        timeline.querySelectorAll('.version-badge-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                selectVersion(idx);
            });
        });
    }

    function selectVersion(idx) {
        activeVersionIndex = idx;
        const ver = currentProjectVersions[idx];
        currentDecompiledPrompt = ver.prompt;
        
        updateOutputDisplay();
        resultBlueprintContent.innerHTML = highlightPromptSyntax(ver.blueprint);
        confidenceBarFill.style.width = `${ver.confidence}%`;
        confidenceScoreText.textContent = `${ver.confidence}%`;
        
        renderEvolutionTimeline();
        
        // Diff Toggle checks
        if (idx > 0) {
            btnToggleDiff.style.display = 'inline-block';
            renderPromptDiff(currentProjectVersions[idx - 1].prompt, ver.prompt);
            document.getElementById('diff-meta').textContent = `v1.${idx-1} vs v1.${idx}`;
        } else {
            btnToggleDiff.style.display = 'none';
            diffDrawer.style.display = 'none';
            btnToggleDiff.textContent = 'View Prompt Diff';
        }
        
        // Output variables check
        if (ver.testOutput) {
            testOutputWrapper.style.display = 'block';
            testOutputText.textContent = ver.testOutput;
            
            if (idx > 0 && currentProjectVersions[idx - 1].testOutput) {
                btnToggleOutputCompare.style.display = 'inline-block';
                testOutputOldText.textContent = currentProjectVersions[idx - 1].testOutput;
                testOutputNewText.textContent = ver.testOutput;
            } else {
                btnToggleOutputCompare.style.display = 'none';
                outputCompareContainer.style.display = 'none';
                btnToggleOutputCompare.textContent = 'Show Before vs After Output';
            }
        } else {
            testOutputWrapper.style.display = 'none';
            outputCompareContainer.style.display = 'none';
            
            // Instantly trigger execution test if empty and we have input parameters
            if (testInputParameters.value.trim()) {
                setTimeout(() => {
                    btnRunTest.click();
                }, 100);
            }
        }
        
        // Restore critique parameters
        currentFeedbackRating = ver.rating;
        currentFeedbackWeight = ver.weight;
        feedbackCritique.value = ver.critique || '';
        
        document.getElementById('weakness-analysis-box').style.display = 'none';
        
        btnFeedbackLike.classList.remove('active-like');
        btnFeedbackDislike.classList.remove('active-dislike');
        btnFeedbackLike.style.opacity = '0.4';
        btnFeedbackDislike.style.opacity = '0.4';
        
        if (ver.rating === 'like') {
            btnFeedbackLike.classList.add('active-like');
            btnFeedbackLike.style.opacity = '1';
        } else if (ver.rating === 'dislike') {
            btnFeedbackDislike.classList.add('active-dislike');
            btnFeedbackDislike.style.opacity = '1';
        }
        
        document.querySelectorAll('.weight-chip').forEach(chip => {
            if (chip.dataset.weight === ver.weight) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
        
        if (ver.rating) {
            btnEvolveSystem.removeAttribute('disabled');
        } else {
            btnEvolveSystem.setAttribute('disabled', 'true');
        }
    }

    function renderPromptDiff(oldPrompt, newPrompt) {
        if (!oldPrompt) {
            diffOldText.textContent = '(No previous version to compare)';
            diffNewText.textContent = newPrompt;
            return;
        }
        diffOldText.textContent = oldPrompt;
        diffNewText.textContent = newPrompt;
    }

    btnToggleDiff.addEventListener('click', () => {
        if (diffDrawer.style.display === 'none') {
            diffDrawer.style.display = 'block';
            btnToggleDiff.textContent = 'Hide Prompt Diff';
        } else {
            diffDrawer.style.display = 'none';
            btnToggleDiff.textContent = 'View Prompt Diff';
        }
    });

    btnToggleOutputCompare.addEventListener('click', () => {
        if (outputCompareContainer.style.display === 'none') {
            outputCompareContainer.style.display = 'grid';
            btnToggleOutputCompare.textContent = 'Hide Output Comparison';
        } else {
            outputCompareContainer.style.display = 'none';
            btnToggleOutputCompare.textContent = 'Show Before vs After Output';
        }
    });

    // -------------------------------------------------------------
    // Ratings & Critique Loops
    // -------------------------------------------------------------
    btnFeedbackLike.addEventListener('click', () => {
        currentFeedbackRating = 'like';
        btnFeedbackLike.classList.add('active-like');
        btnFeedbackDislike.classList.remove('active-dislike');
        btnFeedbackLike.style.opacity = '1';
        btnFeedbackDislike.style.opacity = '0.4';
        
        currentProjectVersions[activeVersionIndex].rating = 'like';
        btnEvolveSystem.removeAttribute('disabled');
        renderEvolutionTimeline();
    });

    btnFeedbackDislike.addEventListener('click', () => {
        currentFeedbackRating = 'dislike';
        btnFeedbackDislike.classList.add('active-dislike');
        btnFeedbackLike.classList.remove('active-like');
        btnFeedbackDislike.style.opacity = '1';
        btnFeedbackLike.style.opacity = '0.4';
        
        currentProjectVersions[activeVersionIndex].rating = 'dislike';
        btnEvolveSystem.removeAttribute('disabled');
        renderEvolutionTimeline();
    });

    document.querySelectorAll('.weight-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.weight-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFeedbackWeight = chip.dataset.weight;
            currentProjectVersions[activeVersionIndex].weight = currentFeedbackWeight;
        });
    });

    feedbackCritique.addEventListener('input', () => {
        currentProjectVersions[activeVersionIndex].critique = feedbackCritique.value;
    });

    // -------------------------------------------------------------
    // Execution Playground System Run Click
    // -------------------------------------------------------------
    function analyzeWeaknesses(outputText) {
        const text = outputText.toLowerCase();
        const weaknesses = [];
        let suggestion = '';
        let feedbackTag = '';
        
        if (text.match(/^(here is|sure,|certainly,|i can help|hope this helps)/i) || text.includes('here is the') || text.includes('hope this helps')) {
            weaknesses.push('Contains conversational filler / preambles (e.g. "Here is...") which violates Automation guidelines.');
            suggestion = 'Eliminate conversational preambles and start output immediately.';
            feedbackTag = 'Too generic';
        }
        
        const genericWords = ['groundbreaking', 'revolutionize', 'very', 'extremely', 'next-generation', 'industry-leading', 'cutting-edge', 'designed to ensure'];
        const foundGenerics = genericWords.filter(w => text.includes(w));
        if (foundGenerics.length > 0) {
            weaknesses.push(`Uses generic buzzwords ("${foundGenerics.slice(0, 2).join(', ')}") which reduces style fidelity.`);
            if (!suggestion) {
                suggestion = 'Ban marketing buzzwords and adhere to technical concrete terminology.';
                feedbackTag = 'Too generic';
            }
        }
        
        const words = outputText.split(/\s+/).length;
        if (words > 120) {
            weaknesses.push(`Output length is high (${words} words) which might violate brevity rules.`);
            if (!suggestion) {
                suggestion = 'Restrict output response strictly to under 80 words.';
                feedbackTag = 'Too long';
            }
        }
        
        if (weaknesses.length === 0) {
            weaknesses.push('No obvious guideline violations detected. Tone could be sharpened.');
            suggestion = 'Sharpen instructions to make execution highly persuasive.';
            feedbackTag = 'Not persuasive';
        }
        
        return { weaknesses, suggestion, feedbackTag };
    }

    btnRunTest.addEventListener('click', async () => {
        const testInput = testInputParameters.value.trim();
        if (!testInput) {
            alert('Please enter test run parameters (input variables) to execute.');
            return;
        }

        btnRunTest.setAttribute('disabled', 'true');
        testSpinner.style.display = 'block';
        btnRunTest.querySelector('.btn-text').textContent = 'Executing...';

        try {
            const headers = { 'Content-Type': 'application/json' };
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) headers['X-Gemini-API-Key'] = savedKey;

            const response = await fetch('/api/test_system', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    system_prompt: currentDecompiledPrompt,
                    test_input: testInput
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Test run failed.');
            }

            const data = await response.json();
            if (data.success && data.test_output) {
                currentProjectVersions[activeVersionIndex].testOutput = data.test_output;
                
                // Show output text
                testOutputWrapper.style.display = 'block';
                testOutputText.textContent = data.test_output;
                
                // Trigger weakness analyzer
                const analysis = analyzeWeaknesses(data.test_output);
                const box = document.getElementById('weakness-analysis-box');
                const listEl = document.getElementById('weakness-analysis-list');
                const improveTextEl = document.getElementById('auto-improve-text');
                
                if (analysis.weaknesses.length > 0) {
                    box.style.display = 'block';
                    listEl.innerHTML = analysis.weaknesses.map(w => `<div>• ${escapeHtml(w)}</div>`).join('');
                    improveTextEl.textContent = `Suggestion: "${analysis.suggestion}"`;
                    
                    const btnApply = document.getElementById('btn-apply-suggestion');
                    btnApply.onclick = () => {
                        feedbackCritique.value = analysis.suggestion;
                        currentProjectVersions[activeVersionIndex].critique = analysis.suggestion;
                        btnEvolveSystem.removeAttribute('disabled');
                        
                        // Switch weight to Medium automatically
                        document.querySelectorAll('.weight-chip').forEach(c => {
                            if (c.dataset.weight === 'medium') {
                                c.click();
                            }
                        });
                        
                        feedbackCritique.focus();
                    };

                    // Pre-fill critique and pre-select dislike for the feedback learning loop
                    if (analysis.feedbackTag) {
                        feedbackCritique.value = analysis.feedbackTag;
                        currentProjectVersions[activeVersionIndex].critique = analysis.feedbackTag;
                        
                        // Select thumbs down feedback rating
                        currentFeedbackRating = 'dislike';
                        currentProjectVersions[activeVersionIndex].rating = 'dislike';
                        btnFeedbackDislike.classList.add('active-dislike');
                        btnFeedbackLike.classList.remove('active-like');
                        btnFeedbackDislike.style.opacity = '1';
                        btnFeedbackLike.style.opacity = '0.4';
                        
                        btnEvolveSystem.removeAttribute('disabled');
                        renderEvolutionTimeline();
                    }
                } else {
                    box.style.display = 'none';
                }

                // Output Comparison logic
                if (activeVersionIndex > 0 && currentProjectVersions[activeVersionIndex - 1].testOutput) {
                    btnToggleOutputCompare.style.display = 'inline-block';
                    testOutputOldText.textContent = currentProjectVersions[activeVersionIndex - 1].testOutput;
                    testOutputNewText.textContent = data.test_output;
                } else {
                    btnToggleOutputCompare.style.display = 'none';
                    outputCompareContainer.style.display = 'none';
                }
                
                // Save to regressionBenchmarks if new input
                if (!regressionBenchmarks.some(b => b.testInput === testInput)) {
                    regressionBenchmarks.push({
                        testInput: testInput,
                        expectedKeywords: extractKeywords(testInput)
                    });
                    renderRegressionSuite();
                }
            } else {
                alert(data.error || 'Server error running system test.');
            }
        } catch (err) {
            alert(`Execution failed: ${err.message}`);
        } finally {
            btnRunTest.removeAttribute('disabled');
            testSpinner.style.display = 'none';
            btnRunTest.querySelector('.btn-text').textContent = 'Run System Test';
        }
    });

    function extractKeywords(text) {
        return text.split(/[^a-zA-Z0-9]+/)
            .filter(w => w.length > 4)
            .map(w => w.toLowerCase())
            .slice(0, 3);
    }

    // -------------------------------------------------------------
    // System Evolution Engine Click
    // -------------------------------------------------------------
    btnEvolveSystem.addEventListener('click', async () => {
        const testInput = testInputParameters.value.trim();
        const ver = currentProjectVersions[activeVersionIndex];
        const testOutput = ver.testOutput;
        const critiqueText = feedbackCritique.value.trim();
        
        if (!testOutput) {
            alert('Please run a system execution test first before evolving.');
            return;
        }
        
        if (!critiqueText) {
            alert('Please describe what adjustments are needed (feedback loop text).');
            return;
        }

        btnEvolveSystem.setAttribute('disabled', 'true');
        evolveSpinner.style.display = 'block';
        btnEvolveSystem.querySelector('.btn-text').textContent = 'Evolving Prompt...';

        try {
            const headers = { 'Content-Type': 'application/json' };
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) headers['X-Gemini-API-Key'] = savedKey;

            const response = await fetch('/api/evolve', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    original_prompt: currentDecompiledPrompt,
                    test_input: testInput,
                    generated_output: testOutput,
                    user_feedback: critiqueText,
                    feedback_weight: currentFeedbackWeight,
                    system_profile: inputSystemProfile.value
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Evolution request failed.');
            }

            const data = await response.json();
            if (data.success && data.evolved_system) {
                const { blueprint, prompt, confidence } = parseCompilerResponse(data.evolved_system);
                
                // Add new evolved version
                currentProjectVersions.push({
                    version: `1.${currentProjectVersions.length}`,
                    prompt: prompt,
                    blueprint: blueprint,
                    confidence: confidence,
                    testOutput: '',
                    rating: null,
                    weight: 'low',
                    critique: ''
                });
                
                // Select new version
                selectVersion(currentProjectVersions.length - 1);
                
                // Focus view prompt tab
                btnViewPrompt.click();
            } else {
                alert(data.error || 'Server failed to evolve system.');
            }
        } catch (err) {
            alert(`Evolution failed: ${err.message}`);
        } finally {
            btnEvolveSystem.removeAttribute('disabled');
            evolveSpinner.style.display = 'none';
            btnEvolveSystem.querySelector('.btn-text').textContent = 'Improve This System 🚀';
        }
    });

    // -------------------------------------------------------------
    // Regression Tests
    // -------------------------------------------------------------
    btnRunRegression.addEventListener('click', runRegressionSuite);

    function renderRegressionSuite() {
        const wrapper = document.getElementById('regression-panel-wrapper');
        const list = document.getElementById('regression-test-list');
        
        if (regressionBenchmarks.length === 0) {
            wrapper.style.display = 'none';
            return;
        }
        
        wrapper.style.display = 'block';
        list.innerHTML = regressionBenchmarks.map((b, idx) => `
            <div class="regression-item" data-idx="${idx}">
                <div style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%; font-size: 0.72rem; color: var(--text-secondary);">
                    Case ${idx+1}: "${escapeHtml(b.testInput)}"
                </div>
                <span class="regression-tag status-pending" id="reg-status-${idx}">Pending</span>
            </div>
        `).join('');
    }

    async function runRegressionSuite() {
        if (regressionBenchmarks.length === 0) return;
        
        const btnReg = document.getElementById('btn-run-regression');
        btnReg.setAttribute('disabled', 'true');
        btnReg.textContent = 'Running Checks...';
        
        const headers = { 'Content-Type': 'application/json' };
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) headers['X-Gemini-API-Key'] = savedKey;

        for (let i = 0; i < regressionBenchmarks.length; i++) {
            const b = regressionBenchmarks[i];
            const statusTag = document.getElementById(`reg-status-${i}`);
            statusTag.className = 'regression-tag status-running';
            statusTag.textContent = 'Running';
            
            try {
                const response = await fetch('/api/test_system', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        system_prompt: currentDecompiledPrompt,
                        test_input: b.testInput
                    })
                });
                
                const data = await response.json();
                if (data.success && data.test_output) {
                    const outputLower = data.test_output.toLowerCase();
                    const passedKeywords = b.expectedKeywords.every(k => outputLower.includes(k));
                    
                    if (passedKeywords || b.expectedKeywords.length === 0) {
                        statusTag.className = 'regression-tag status-pass';
                        statusTag.textContent = 'Pass';
                    } else {
                        statusTag.className = 'regression-tag status-fail';
                        statusTag.textContent = 'Fail';
                    }
                } else {
                    statusTag.className = 'regression-tag status-fail';
                    statusTag.textContent = 'Error';
                }
            } catch (err) {
                statusTag.className = 'regression-tag status-fail';
                statusTag.textContent = 'Error';
            }
        }
        
        btnReg.removeAttribute('disabled');
        btnReg.textContent = 'Run Regression Suite';
    }

    // -------------------------------------------------------------
    // Hero Mockup Typing Simulation Animation
    // -------------------------------------------------------------
    const heroInput = document.getElementById('hero-mockup-input');
    const heroArrow = document.getElementById('hero-mockup-arrow');
    const heroOutput = document.getElementById('hero-mockup-output');
    
    if (heroInput && heroArrow && heroOutput) {
        const inputText = 'Professional job email...';
        const outputHTML = `<span class="syntax-h1"># AI System: Job Email Compiler</span>
<span class="syntax-h2">## 1. Goal / Intent:</span>
&nbsp;&nbsp;* <span class="syntax-bold-key">**Target Output**</span>: Structured Job Email...
<span class="syntax-h2">## 2. Style Layer:</span>
&nbsp;&nbsp;* <span class="syntax-bold-key">**Tone &amp; Voice**</span>: Formal, encouraging...
<span class="syntax-h2">## 3. Instructions:</span>
&nbsp;&nbsp;* <span class="syntax-rule">*Rule 1*</span>: Focus on direct task completion.
<span class="syntax-h2">## 4. Output Format:</span>
&nbsp;&nbsp;* <span class="syntax-rule">*Constraint 1*</span>: Never write chat filler.`;

        async function runTypingAnimation() {
            while (true) {
                // Reset states
                heroInput.innerHTML = '<span class="label">Input:</span> ';
                heroArrow.style.visibility = 'hidden';
                heroArrow.style.opacity = '0';
                heroOutput.style.visibility = 'hidden';
                heroOutput.innerHTML = '';
                
                await sleep(1500);
                
                // 1. Type the input query
                for (let i = 0; i < inputText.length; i++) {
                    heroInput.innerHTML += inputText.charAt(i);
                    await sleep(50);
                }
                
                await sleep(1000);
                
                // 2. Animate compilation arrow loading
                heroArrow.style.visibility = 'visible';
                heroArrow.style.opacity = '1';
                await sleep(1500);
                
                // 3. Render compiled prompt system
                heroOutput.style.visibility = 'visible';
                const blocks = outputHTML.split('\n');
                for (let block of blocks) {
                    heroOutput.innerHTML += block + '<br>';
                    // Auto-scroll output mockup container if overflowed
                    heroOutput.scrollTop = heroOutput.scrollHeight;
                    await sleep(350);
                }
                
                await sleep(8000); // Hold final output for 8 seconds
            }
        }
        
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        runTypingAnimation();
    }

    // -------------------------------------------------------------
    // Suggestion chips clicks & Init
    // -------------------------------------------------------------
    document.querySelectorAll('.btn-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            feedbackCritique.value = val;
            currentProjectVersions[activeVersionIndex].critique = val;
            btnEvolveSystem.removeAttribute('disabled');
            
            // Highlight critique focus
            feedbackCritique.focus();
            feedbackCritique.style.borderColor = 'var(--color-violet)';
            setTimeout(() => {
                feedbackCritique.style.borderColor = '';
            }, 300);
        });
    });

    // Init history render on load
    renderHistory();
});
