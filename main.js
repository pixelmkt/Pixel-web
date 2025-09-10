// main.js
document.addEventListener('DOMContentLoaded', () => {
    let currentMode = 'single';
    let uploadedImages = { main: null };
    let collectionImages = [];
    let presets = [];

    const ui = {
        brandNameHeader: document.getElementById('brand-name-header'),
        generateBtn: document.getElementById('generate-btn'),
        resultsGallery: document.getElementById('results-gallery'),
        galleryPlaceholder: document.getElementById('gallery-placeholder'),
        galleryLoader: document.getElementById('gallery-loader'),
        modeSingleBtn: document.getElementById('mode-single'),
        modeCollectionBtn: document.getElementById('mode-collection'),
        singleProductPanel: document.getElementById('single-product-panel'),
        collectionPanel: document.getElementById('collection-photoshoot-panel'),
        collectionUploader: document.getElementById('uploader-collection'),
        collectionInput: document.getElementById('collection-input'),
        collectionPreviews: document.getElementById('collection-previews'),
        styleDropdown: document.getElementById('photo-style'),
        collectionStyleDropdown: document.getElementById('collection-photo-style'),
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        brandNameInput: document.getElementById('brand-name-input'),
        googleApiKeyInput: document.getElementById('google-api-key-input'),
        settingsSaveBtn: document.getElementById('settings-save-btn'),
        settingsCancelBtn: document.getElementById('settings-cancel-btn'),
        presetsBtn: document.getElementById('presets-btn'),
        presetsModal: document.getElementById('presets-modal'),
        presetsList: document.getElementById('presets-list'),
        newPresetName: document.getElementById('new-preset-name'),
        newPresetPrompt: document.getElementById('new-preset-prompt'),
        addPresetBtn: document.getElementById('add-preset-btn'),
        presetsCloseBtn: document.getElementById('presets-close-btn'),
        alertModal: document.getElementById('alert-modal'),
        alertTitle: document.getElementById('alert-title'),
        alertMessage: document.getElementById('alert-message'),
        alertCloseBtn: document.getElementById('alert-close-btn'),
    };
    
    const defaultPresets = [
        { name: "Cinematic 85mm", prompt: "Cinematic shot, hyperrealistic, sharp focus of a {model_desc}. Shot on a Sony A7R IV, 85mm f/1.4 lens, professional color grading, subtle film grain. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Luz Natural Suave", prompt: "Photoshoot with soft, diffused natural light. A {model_desc} in a calm pose. Shot on a Fujifilm GFX 100S, incredibly detailed textures, serene mood. Hyperrealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Contraluz Dramático", prompt: "Dramatic backlit portrait of a {model_desc}, silhouetted against a strong light source, creating a powerful rim light. High contrast, emotional. Shot on a Canon EOS R5, 50mm f/1.2. Photorealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Look de Estudio Limpio", prompt: "Professional e-commerce photoshoot in a studio with perfect, even lighting against a solid light gray background (#f2f2f2). A {model_desc} with a neutral expression. Shot on a Phase One camera, macro lens for extreme detail on the fabric. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Estilo Editorial de Moda", prompt: "High-fashion editorial. A {model_desc} in an avant-garde pose. Creative, directional lighting. Shot on a Hasselblad X2D, sharp, high-end look, impeccable styling. Hyperrealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Blanco y Negro de Alto Contraste", prompt: "High-contrast black and white portrait of a {model_desc}. Deep blacks, bright whites, focus on texture and form. Timeless and powerful. Shot on a Leica M11 Monochrom, 35mm Summilux. Photorealistic, film grain. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Hora Dorada", prompt: "Photoshoot during the golden hour. A {model_desc} is bathed in warm, soft, glowing light. Dreamy depth of field. Shot on a Canon EOS 5D Mark IV, 85mm f/1.2 lens. Photorealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Estilo Análogo (Film Look)", prompt: "Candid portrait with the aesthetic of 35mm film. A {model_desc} in a natural pose. Visible film grain, slightly muted colors, nostalgic feel. Shot on Portra 400 film. Hyperrealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Luz de Neón", prompt: "Photoshoot illuminated by vibrant neon lights. A {model_desc} with a modern, edgy look. Reflections, high contrast, cyberpunk aesthetic. Shot on a Sony A7S III, fast prime lens. Cinematic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Beauty Shot / Macro", prompt: "Macro beauty shot focusing on the face of a {model_desc}. Flawless skin texture, perfect lighting to highlight features. Shot on a Canon 100mm Macro lens. Hyper-detailed, clean, commercial look. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Lens Flare Artístico", prompt: "Creative portrait using artistic lens flare. A {model_desc} interacts with the light. Warm, ethereal, and dreamy mood. Shot against a light source with an anamorphic lens. Cinematic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Luz de Ventana (Rembrandt)", prompt: "Classic portrait using a single window as a light source. A {model_desc} with a thoughtful expression. Rembrandt lighting triangle on the cheek. Moody, deep shadows. Shot on a Nikon Z8. Photorealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Estilo Portada de Revista", prompt: "A powerful, full-body shot worthy of a magazine cover. A {model_desc} in a commanding pose. Impeccable styling, perfect studio lighting. High-fashion, sharp, iconic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Fotografía de Movimiento", prompt: "Dynamic shot capturing a {model_desc} in motion. Slight motion blur on the limbs, but face in sharp focus. Energetic, athletic feel. Shot with a high shutter speed. Hyperrealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Estilo de Vida Cándido", prompt: "Candid lifestyle shot. A {model_desc} laughing or interacting naturally. Believable, authentic moment. Soft, natural light. Shot on a Fujifilm X-T5, 35mm f/1.4. Photorealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Silueta Dramática", prompt: "Striking silhouette of a {model_desc}. Minimal detail on the subject, focus on the shape and powerful lines. Dramatic and evocative. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Iluminación de Gel de Color", prompt: "Creative studio portrait using colored gels (e.g., pink and blue) to create a vibrant, modern look. A {model_desc} with a bold expression. High-energy, artistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Look Húmedo (Wet Look)", prompt: "Edgy photoshoot with a 'wet look'. A {model_desc} with glistening skin and wet hair. Specular highlights, dramatic lighting. High-fashion, sensual. Shot on a medium format camera. Hyperrealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Minimalismo Arquitectónico", prompt: "A {model_desc} interacting with clean, minimalist architectural lines. Focus on form, shadow, and composition. Clean, graphic, and modern. Shot with a wide-angle lens, deep depth of field. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed, blurry." },
        { name: "Producto en Maniquí Fantasma", prompt: "Professional e-commerce shot of the garment on an invisible mannequin (ghost mannequin effect), in a studio with perfect, even lighting against a solid light gray background (#f2f2f2). Shot on a Phase One camera, macro lens for extreme detail on the fabric. AVOID: human models, 3d render, cartoon, deformed, blurry." },
    ];
    
    // --- Lógica de Modales ---
    const openModal = (modal) => { modal.classList.remove('hidden', 'opacity-0'); modal.classList.add('flex'); setTimeout(() => modal.querySelector('.modal-content').classList.remove('scale-95'), 10); };
    const closeModal = (modal) => { modal.querySelector('.modal-content').classList.add('scale-95'); modal.classList.add('opacity-0'); setTimeout(() => modal.classList.add('hidden'), 300); };
    const showAlert = (message, title = "Atención") => { ui.alertTitle.textContent = title; ui.alertMessage.textContent = message; openModal(ui.alertModal); };
    
    // --- Lógica de Configuración y Presets ---
    const loadSettings = () => { const brandName = localStorage.getItem('brandName') || 'Studio Pixel'; const apiKey = localStorage.getItem('googleApiKey') || ''; ui.brandNameHeader.textContent = brandName; ui.brandNameInput.value = brandName; ui.googleApiKeyInput.value = apiKey; };
    const saveSettings = () => { localStorage.setItem('brandName', ui.brandNameInput.value); localStorage.setItem('googleApiKey', ui.googleApiKeyInput.value); loadSettings(); closeModal(ui.settingsModal); };
    const loadPresets = () => { const storedPresets = localStorage.getItem('customPresets'); presets = storedPresets ? JSON.parse(storedPresets) : defaultPresets; if (!storedPresets) localStorage.setItem('customPresets', JSON.stringify(presets)); populatePresetDropdowns(); renderPresetsManager(); };
    const populatePresetDropdowns = () => { [ui.styleDropdown, ui.collectionStyleDropdown].forEach(dropdown => { dropdown.innerHTML = ''; presets.forEach((preset, index) => { const option = document.createElement('option'); option.value = index; option.textContent = preset.name; dropdown.appendChild(option); }); }); };
    const renderPresetsManager = () => { ui.presetsList.innerHTML = ''; presets.forEach((preset, index) => { const div = document.createElement('div'); div.className = 'preset-card'; div.innerHTML = `<div><p class="font-bold">${preset.name}</p><p class="prompt-preview">${preset.prompt}</p></div><button data-index="${index}" class="delete-preset-btn text-red-500 hover:text-red-700 ml-2 flex-shrink-0 font-bold text-xl">&times;</button>`; ui.presetsList.appendChild(div); }); };
    const saveNewPreset = () => { const name = ui.newPresetName.value.trim(); const prompt = ui.newPresetPrompt.value.trim(); if (name && prompt) { presets.push({ name, prompt }); localStorage.setItem('customPresets', JSON.stringify(presets)); loadPresets(); ui.newPresetName.value = ''; ui.newPresetPrompt.value = ''; } };
    const deletePreset = (index) => { if (presets.length <= 1) { showAlert("Debes tener al menos un estilo."); return; } presets.splice(index, 1); localStorage.setItem('customPresets', JSON.stringify(presets)); loadPresets(); };
    
    // --- Lógica de la Interfaz Principal ---
    const checkGenerateButtonState = () => { ui.generateBtn.disabled = (currentMode === 'single') ? !uploadedImages.main : collectionImages.length === 0;};
    const switchMode = (mode) => { currentMode = mode; const btnSingleClasses = mode === 'single' ? ['bg-white', 'text-rojo-acento', 'shadow'] : ['text-gris-oscuro']; const btnCollectionClasses = mode === 'collection' ? ['bg-white', 'text-rojo-acento', 'shadow'] : ['text-gris-oscuro']; ui.modeSingleBtn.classList.remove('bg-white', 'text-rojo-acento', 'shadow', 'text-gris-oscuro'); ui.modeSingleBtn.classList.add(...btnSingleClasses); ui.modeCollectionBtn.classList.remove('bg-white', 'text-rojo-acento', 'shadow', 'text-gris-oscuro'); ui.modeCollectionBtn.classList.add(...btnCollectionClasses); ui.singleProductPanel.classList.toggle('hidden', mode !== 'single'); ui.collectionPanel.classList.toggle('hidden', mode !== 'collection'); checkGenerateButtonState(); };
    
    // --- Lógica de Subida de Archivos ---
    function initializeUploader(uploaderId) { const uploaderEl = document.getElementById(uploaderId); const inputEl = uploaderEl.querySelector('.image-input'); const promptEl = uploaderEl.querySelector('.upload-prompt'); const previewContainerEl = uploaderEl.querySelector('.image-preview-container'); const previewEl = uploaderEl.querySelector('.image-preview'); const removeBtn = uploaderEl.querySelector('.remove-image-btn'); const uploaderKey = inputEl.dataset.uploader; uploaderEl.addEventListener('click', (e) => { if (!e.target.classList.contains('remove-image-btn')) { inputEl.click(); } }); inputEl.addEventListener('change', e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = re => { uploadedImages[uploaderKey] = re.target.result.split(',')[1]; previewEl.src = re.target.result; promptEl.classList.add('hidden'); previewContainerEl.classList.remove('hidden'); checkGenerateButtonState(); }; reader.readAsDataURL(file); } }); removeBtn.addEventListener('click', e => { e.stopPropagation(); inputEl.value = ''; uploadedImages[uploaderKey] = null; promptEl.classList.remove('hidden'); previewContainerEl.classList.add('hidden'); checkGenerateButtonState(); }); }
    initializeUploader('uploader-main');
    ui.collectionUploader.addEventListener('click', () => ui.collectionInput.click());
    ui.collectionInput.addEventListener('change', e => { const files = Array.from(e.target.files); if (collectionImages.length + files.length > 10) { showAlert("Puedes subir un máximo de 10 prendas."); return; } files.forEach(file => { const reader = new FileReader(); reader.onload = re => { const base64 = re.target.result.split(',')[1]; collectionImages.push({ name: file.name, base64 }); renderCollectionPreviews(); checkGenerateButtonState(); }; reader.readAsDataURL(file); }); ui.collectionInput.value = ''; });
    const renderCollectionPreviews = () => { ui.collectionPreviews.innerHTML = ''; collectionImages.forEach((img, index) => { const div = document.createElement('div'); div.className = 'relative aspect-square'; div.innerHTML = `<img src="data:image/png;base64,${img.base64}" class="w-full h-full object-cover rounded-md"><button data-index="${index}" class="remove-collection-item absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">&times;</button>`; ui.collectionPreviews.appendChild(div); }); ui.collectionUploader.querySelector('.upload-prompt').classList.toggle('hidden', collectionImages.length > 0); };
    ui.collectionPreviews.addEventListener('click', e => { if (e.target.classList.contains('remove-collection-item')) { collectionImages.splice(parseInt(e.target.dataset.index, 10), 1); renderCollectionPreviews(); checkGenerateButtonState(); } });

    // --- Lógica de Generación de Imágenes ---
    const setLoadingState = (isLoading, current = 0, total = 0) => { ui.generateBtn.disabled = isLoading; ui.galleryLoader.classList.toggle('hidden', !isLoading); ui.generateBtn.querySelector('span').textContent = isLoading ? "Generando..." : "Generar"; if (!isLoading && ui.resultsGallery.children.length === 0) { ui.galleryPlaceholder.classList.remove('hidden'); }};
    const addImageToGallery = (imageUrl, delay = 0) => { const card = document.createElement('div'); card.className = 'relative aspect-[4/5] rounded-lg shadow-md overflow-hidden fade-in'; card.style.animationDelay = `${delay * 100}ms`; card.innerHTML = `<img src="${imageUrl}" alt="Generated image" class="w-full h-full object-cover"><a href="${imageUrl}" download="StudioPixel_Result_${Date.now()}.png" class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"><i class="fas fa-download"></i></a>`; ui.resultsGallery.prepend(card); };
    function constructPrompt(collectionItems = null) {
        if (currentMode === 'single') {
            const presetIndex = ui.styleDropdown.value; const selectedPreset = presets[presetIndex];
            const modelDesc = document.getElementById('model-desc').value || 'professional model';
            return selectedPreset.prompt.replace('{model_desc}', modelDesc);
        } else {
            const presetIndex = ui.collectionStyleDropdown.value; const selectedPreset = presets[presetIndex];
            const baseDesc = document.getElementById('collection-prompt').value || 'A group of models';
            let finalPrompt = selectedPreset.prompt.replace('{model_desc}', baseDesc);
            const garmentNames = collectionItems.map(g => `'${g.name}'`).join(', ');
            finalPrompt += ` The models are showcasing a collection of garments including: ${collectionItems.length} items from this collection. Create a cohesive campaign image.`;
            return finalPrompt;
        }
    }
    
    async function callGeminiAPI(prompt, base64ImagesArray) {
        const apiKey = localStorage.getItem('googleApiKey');
        const model = 'gemini-pro-vision'; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const parts = [{ text: prompt }];
        base64ImagesArray.forEach(imgData => { parts.push({ inline_data: { mime_type: "image/png", data: imgData } }); });
        const payload = { contents: [{ parts }] };
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error?.message || 'Error desconocido'}`); }
        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
        if (!base64Data) { if (result.candidates && result.candidates[0] && result.candidates[0].finishReason === 'SAFETY') { throw new Error("Imagen bloqueada por políticas de seguridad de la IA."); } throw new Error("La API no devolvió una imagen. Revisa el modelo o la respuesta."); }
        return `data:image/png;base64,${base64Data}`;
    }
    
    async function handleGeneration(prompt, images) {
        try {
            const generatedImageUrl = await callGeminiAPI(prompt, images);
            addImageToGallery(generatedImageUrl);
        } catch (error) {
            showAlert(error.message, "Error de Generación");
            throw error;
        }
    }
    
    ui.generateBtn.addEventListener('click', async () => {
        const apiKey = localStorage.getItem('googleApiKey');
        if (!apiKey) { showAlert("Por favor, añade tu API Key en Configuración."); return; }

        setLoadingState(true);
        ui.resultsGallery.innerHTML = '';
        ui.galleryPlaceholder.classList.add('hidden');
        ui.galleryLoader.classList.remove('hidden');

        try {
            if (currentMode === 'single') {
                const prompt = constructPrompt();
                const images = [uploadedImages.main].filter(Boolean);
                await handleGeneration(prompt, images);
            } else {
                const totalGenerations = parseInt(document.getElementById('collection-results-count').value, 10);
                for (let i = 0; i < totalGenerations; i++) {
                    const garmentsForShot = [...collectionImages].sort(() => 0.5 - Math.random()).slice(0, Math.min(Math.floor(Math.random() * 3) + 1, collectionImages.length));
                    const prompt = constructPrompt(garmentsForShot);
                    const images = garmentsForShot.map(g => g.base64);
                    await handleGeneration(prompt, images);
                }
            }
        } catch (e) {
            console.error("Fallo el proceso de generación:", e);
        } finally {
            setLoadingState(false);
        }
    });

    // --- INITIALIZATION ---
    ui.settingsBtn.addEventListener('click', () => openModal(ui.settingsModal));
    ui.settingsCancelBtn.addEventListener('click', () => closeModal(ui.settingsModal));
    ui.settingsSaveBtn.addEventListener('click', saveSettings);
    ui.presetsBtn.addEventListener('click', () => openModal(ui.presetsModal));
    ui.presetsCloseBtn.addEventListener('click', () => closeModal(ui.presetsModal));
    ui.addPresetBtn.addEventListener('click', saveNewPreset);
    ui.presetsList.addEventListener('click', (e) => { if (e.target.classList.contains('delete-preset-btn')) { const index = e.target.dataset.index; if (confirm(`¿Eliminar el estilo "${presets[index].name}"?`)) { deletePreset(index); } } });
    ui.alertCloseBtn.addEventListener('click', () => closeModal(ui.alertModal));
    ui.modeSingleBtn.addEventListener('click', () => switchMode('single'));
    ui.modeCollectionBtn.addEventListener('click', () => switchMode('collection'));
    
    function init() { loadSettings(); loadPresets(); checkGenerateButtonState(); }
    init();
});
</script>

</body>
</html>