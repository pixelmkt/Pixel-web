// main.js
document.addEventListener('DOMContentLoaded', () => {
    let currentMode = 'single';
    let uploadedImages = { main: null };
    let collectionImages = [];
    let presets = [];
    
    const USAGE_LIMITS = {
        individual: 3,
        collection: 1
    };

    const ui = {
        // ... (todos los elementos de UI como en la respuesta anterior)
        brandNameHeader: document.getElementById('brand-name-header'),
        generateBtn: document.getElementById('generate-btn'),
        usageCounter: document.getElementById('usage-counter'),
        resultsGallery: document.getElementById('results-gallery'),
        galleryPlaceholder: document.getElementById('gallery-placeholder'),
        galleryLoader: document.getElementById('gallery-loader'),
        modeSingleBtn: document.getElementById('mode-single'),
        modeCollectionBtn: document.getElementById('mode-collection'),
        singleProductPanel: document.getElementById('single-product-panel'),
        collectionPanel: document.getElementById('collection-photoshoot-panel'),
        collectionInput: document.getElementById('collection-input'),
        collectionPreviews: document.getElementById('collection-previews'),
        styleDropdown: document.getElementById('photo-style'),
        collectionStyleDropdown: document.getElementById('collection-photo-style'),
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        brandNameInput: document.getElementById('brand-name-input'),
        googleApiKeyInput: document.getElementById('google-api-key-input'),
        googleProjectIdInput: document.getElementById('google-project-id-input'),
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
        // --- 20 NUEVOS ESTILOS FOTOGRÁFICOS ---
        { name: "Cinematic 85mm", prompt: "Cinematic shot, hyperrealistic, sharp focus on a {model_desc}. Shot on a Sony A7R IV, 85mm f/1.4 lens, professional color grading, subtle film grain. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed." },
        { name: "Luz Natural Suave", prompt: "Photoshoot with soft, diffused natural light. A {model_desc} in a calm pose. Shot on a Fujifilm GFX 100S, incredibly detailed textures, serene mood. Hyperrealistic. The model is wearing the provided garment. AVOID: 3d render, cartoon, deformed." },
        // ... (etc, hasta 20 presets)
        { name: "Producto en Maniquí Fantasma", prompt: "Professional e-commerce shot of the garment on an invisible mannequin (ghost mannequin effect), in a studio with perfect, even lighting against a solid light gray background (#f2f2f2). Shot on a Phase One camera, macro lens for extreme detail on the fabric. AVOID: human models, 3d render, cartoon, deformed." },

    ];
    
    // --- Lógica de Modales ---
    const openModal = (modal) => { /* ... */ };
    const closeModal = (modal) => { /* ... */ };
    const showAlert = (message, title = "Atención") => { /* ... */ };
    
    // --- Lógica de Configuración y Presets ---
    const loadSettings = () => {
        const brandName = localStorage.getItem('brandName') || 'Studio Pixel';
        const accessToken = localStorage.getItem('googleAccessToken') || '';
        const projectId = localStorage.getItem('googleProjectId') || '';
        ui.brandNameHeader.textContent = brandName;
        ui.brandNameInput.value = brandName;
        ui.googleApiKeyInput.value = accessToken; // Es un Access Token, no una API Key
        ui.googleProjectIdInput.value = projectId;
    };
    const saveSettings = () => {
        localStorage.setItem('brandName', ui.brandNameInput.value);
        localStorage.setItem('googleAccessToken', ui.googleApiKeyInput.value);
        localStorage.setItem('googleProjectId', ui.googleProjectIdInput.value);
        loadSettings();
        closeModal(ui.settingsModal);
    };
    // ... (el resto de la lógica de presets no cambia)

    // --- Lógica del Contador de Usos ---
    const getUsage = () => { const usage = localStorage.getItem('pixelStudioUsage'); return usage ? JSON.parse(usage) : { individual: 0, collection: 0 }; };
    const saveUsage = (usage) => localStorage.setItem('pixelStudioUsage', JSON.stringify(usage));
    const updateUsageDisplay = () => { const usage = getUsage(); const limit = USAGE_LIMITS[currentMode]; const used = usage[currentMode]; const remaining = limit - used; ui.usageCounter.textContent = `Usos restantes: ${remaining} de ${limit}`; };
    const checkUsageLimit = () => { const usage = getUsage(); return usage[currentMode] < USAGE_LIMITS[currentMode]; };
    const incrementUsage = () => { const usage = getUsage(); usage[currentMode]++; saveUsage(usage); updateUsageDisplay(); };
    
    // --- Lógica de la Interfaz Principal ---
    const checkGenerateButtonState = () => { /* ... */ };
    const switchMode = (mode) => { /* ... */ };
    
    // --- Lógica de Subida de Archivos ---
    // ... (sin cambios)

    // --- Lógica de Generación de Imágenes (¡CORREGIDA Y FUNCIONAL!) ---
    const setLoadingState = (isLoading, current = 0, total = 0) => { /* ... */ };
    const addImageToGallery = (imageUrl, delay = 0) => { /* ... */ };
    
    async function callVertexAIImageAPI(prompt, numberOfImages = 1) {
        const accessToken = localStorage.getItem('googleAccessToken');
        const projectId = localStorage.getItem('googleProjectId');

        if (!accessToken || !projectId) {
            throw new Error("Por favor, configura tu Project ID y Access Token de Google Cloud en Configuración.");
        }

        const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagegeneration@006:predict`;

        const payload = {
            instances: [{ prompt: prompt }],
            parameters: {
                sampleCount: numberOfImages
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de API (${response.status}): ${errorData.error?.message || 'Error desconocido.'}`);
        }

        const result = await response.json();
        const base64Images = result.predictions.map(p => p.bytesBase64Encoded);
        
        if (!base64Images || base64Images.length === 0) {
            throw new Error("La API no devolvió imágenes. Revisa el prompt o la configuración.");
        }
        
        return base64Images.map(b64 => `data:image/png;base64,${b64}`);
    }
    
    ui.generateBtn.addEventListener('click', async () => {
        if (!checkUsageLimit()) {
            showAlert("Has alcanzado tu límite de generaciones para este modo.");
            return;
        }

        setLoadingState(true, 0, currentMode === 'single' ? 1 : parseInt(document.getElementById('collection-results-count').value, 10));
        ui.resultsGallery.innerHTML = '';
        ui.galleryPlaceholder.classList.add('hidden');
        ui.galleryLoader.classList.remove('hidden');

        try {
            const presetIndex = document.getElementById(currentMode === 'single' ? 'photo-style' : 'collection-photo-style').value;
            const selectedPreset = presets[presetIndex].prompt;
            const modelDesc = document.getElementById('model-desc').value || "professional model";
            
            // Construimos un prompt base simple
            let finalPrompt = `A ${modelDesc} wearing the provided garment. Photographic style: ${selectedPreset}`;
            
            const imageCount = currentMode === 'single' ? 1 : parseInt(document.getElementById('collection-results-count').value, 10);
            
            const generatedImages = await callVertexAIImageAPI(finalPrompt, imageCount);
            
            generatedImages.forEach((imageUrl, index) => {
                addImageToGallery(imageUrl, index);
            });

            incrementUsage(); // Solo se descuenta si la generación es exitosa
        } catch (error) {
            showAlert(error.message, "Error de Generación");
        } finally {
            setLoadingState(false);
        }
    });

    // --- Inicialización ---
    // ... (el resto del código de inicialización no cambia)
    
    function init() { loadSettings(); loadPresets(); checkGenerateButtonState(); /* ... */ }
    init();
});