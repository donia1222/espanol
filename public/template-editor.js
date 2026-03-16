/**
 * ═══════════════════════════════════════════════════════
 * LWEB Template Editor — Visual Admin Panel
 * ═══════════════════════════════════════════════════════
 *
 * Usage:
 *   Add data-edit="text" or data-edit="image" to any element.
 *   Each editable element needs data-edit-key="unique-key".
 *
 *   <h1 data-edit="text" data-edit-key="hero-title">My Title</h1>
 *   <img data-edit="image" data-edit-key="hero-bg" src="...">
 *
 *   Initialize:
 *   TemplateEditor.init({ templateId: 'restaurant', clientId: 'demo' });
 *
 * Storage:
 *   - localStorage for now (offline mode)
 *   - Prepared for MySQL API via endpoint
 */

(function () {
    'use strict';

    // ── Config ───────────────────────────────────────
    var CONFIG = {
        templateId: 'default',
        clientId: 'demo',
        apiEndpoint: null,  // Will be set from .env or init()
        useApi: false,
        fonts: [
            { name: 'Inter', family: "'Inter', sans-serif", url: 'Inter:wght@300;400;500;600;700' },
            { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", url: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
            { name: 'Playfair Display', family: "'Playfair Display', serif", url: 'Playfair+Display:wght@400;500;600;700;800' },
            { name: 'Poppins', family: "'Poppins', sans-serif", url: 'Poppins:wght@300;400;500;600;700' },
            { name: 'Montserrat', family: "'Montserrat', sans-serif", url: 'Montserrat:wght@300;400;500;600;700;800' },
            { name: 'Raleway', family: "'Raleway', sans-serif", url: 'Raleway:wght@300;400;500;600;700' },
            { name: 'Lato', family: "'Lato', sans-serif", url: 'Lato:wght@300;400;700;900' },
            { name: 'Roboto', family: "'Roboto', sans-serif", url: 'Roboto:wght@300;400;500;700' },
            { name: 'Oswald', family: "'Oswald', sans-serif", url: 'Oswald:wght@300;400;500;600;700' },
            { name: 'Merriweather', family: "'Merriweather', serif", url: 'Merriweather:wght@300;400;700;900' }
        ]
    };

    // ── State ────────────────────────────────────────
    var isEditing = false;
    var isAuthenticated = false;
    var currentElement = null;
    var currentKey = null;
    var savedData = {};
    var fontsLoaded = {};

    // ── DOM refs (created dynamically) ───────────────
    var toggleBtn, sidebar, overlay, statusBar, toast;

    // ═══════════════════════════════════════════════════
    //  STORAGE LAYER (localStorage + API ready)
    // ═══════════════════════════════════════════════════

    function storageKey() {
        return 'te_' + CONFIG.templateId + '_' + CONFIG.clientId;
    }

    function loadData(callback) {
        if (CONFIG.useApi && CONFIG.apiEndpoint) {
            // API mode — GET data
            var loadUrl = CONFIG.apiEndpoint + 'load';
            console.log('[Editor] Loading from:', loadUrl);
            fetch(loadUrl)
                .then(function (r) {
                    console.log('[Editor] Load status:', r.status);
                    return r.text();
                })
                .then(function (text) {
                    console.log('[Editor] Load body:', text.substring(0, 200));
                    var data;
                    try { data = JSON.parse(text); } catch(e) { data = null; }
                    savedData = data || {};
                    if (callback) callback();
                })
                .catch(function (err) {
                    console.error('[Editor] Load failed:', err);
                    loadFromLocal();
                    if (callback) callback();
                });
        } else {
            loadFromLocal();
            if (callback) callback();
        }
    }

    function loadFromLocal() {
        try {
            var raw = localStorage.getItem(storageKey());
            savedData = raw ? JSON.parse(raw) : {};
        } catch (e) {
            savedData = {};
        }
    }

    function saveData(callback) {
        // Always save to local as cache
        try {
            localStorage.setItem(storageKey(), JSON.stringify(savedData));
        } catch (e) { /* quota exceeded */ }

        if (CONFIG.useApi && CONFIG.apiEndpoint) {
            // API mode — POST data
            var jsonPayload = JSON.stringify(savedData);
            console.log('[Editor] Total payload size:', (jsonPayload.length / 1024).toFixed(1) + ' KB');
            var saveUrl = CONFIG.apiEndpoint + 'save';
            console.log('[Editor] Saving to:', saveUrl, 'Data keys:', Object.keys(savedData));
            fetch(saveUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedData)
            })
                .then(function (r) {
                    console.log('[Editor] Response status:', r.status, r.statusText);
                    return r.text();
                })
                .then(function (text) {
                    console.log('[Editor] Response body:', text);
                    var res;
                    try { res = JSON.parse(text); } catch(e) { res = { success: false }; }
                    showToast(res.success ? 'Gespeichert!' : 'Fehler beim Speichern', res.success ? 'success' : 'error');
                    if (callback) callback(res.success);
                })
                .catch(function (err) {
                    console.error('[Editor] Save failed:', err);
                    showToast('Lokal gespeichert (offline)', 'success');
                    if (callback) callback(true);
                });
        } else {
            showToast('Gespeichert!', 'success');
            if (callback) callback(true);
        }
    }

    // ═══════════════════════════════════════════════════
    //  FONT LOADING
    // ═══════════════════════════════════════════════════

    function loadFont(fontName) {
        if (fontsLoaded[fontName]) return;
        var font = CONFIG.fonts.find(function (f) { return f.name === fontName; });
        if (!font) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + font.url + '&display=swap';
        document.head.appendChild(link);
        fontsLoaded[fontName] = true;
    }

    function loadAllEditorFonts() {
        // Preload all fonts for the selector
        CONFIG.fonts.forEach(function (f) { loadFont(f.name); });
    }

    // ═══════════════════════════════════════════════════
    //  APPLY SAVED DATA TO DOM
    // ═══════════════════════════════════════════════════

    function applyAllSaved() {
        var elements = document.querySelectorAll('[data-edit-key]');
        elements.forEach(function (el) {
            var key = el.getAttribute('data-edit-key');
            var data = savedData[key];
            if (!data) return;

            var editType = el.getAttribute('data-edit');

            if (editType === 'text') {
                if (data.text !== undefined) el.textContent = data.text;
                if (data.color) el.style.color = data.color;
                if (data.fontSize) el.style.fontSize = data.fontSize;
                if (data.fontFamily) {
                    el.style.fontFamily = data.fontFamily;
                    var fontObj = CONFIG.fonts.find(function (f) { return f.family === data.fontFamily; });
                    if (fontObj) loadFont(fontObj.name);
                }
            } else if (editType === 'image') {
                if (data.src) {
                    console.log('[Editor] Applying image for', key, '| src type:', data.src.substring(0, 30) + '...', '| src length:', data.src.length);
                    if (el.tagName === 'IMG') {
                        el.src = data.src;
                    } else {
                        el.style.background = "url('" + data.src + "') center/cover no-repeat";
                    }
                }
                if (data.height) {
                    el.style.height = data.height + 'px';
                    if (el.tagName === 'IMG') el.style.objectFit = 'cover';
                }
                if (data.borderRadius !== undefined && data.borderRadius !== null) {
                    var radiusTarget = el.tagName === 'IMG' ? el.parentElement : el;
                    radiusTarget.style.borderRadius = data.borderRadius + '%';
                    if (el.tagName === 'IMG') el.style.borderRadius = data.borderRadius + '%';
                }
            } else if (editType === 'link') {
                if (data.href) {
                    el.href = data.href;
                    el.target = '_blank';
                    el.rel = 'noopener noreferrer';
                }
                if (data.color) {
                    if (el.getAttribute('data-edit-color-target') === 'background') {
                        el.style.backgroundColor = data.color;
                    } else {
                        el.style.color = data.color;
                    }
                }
                if (data.size) {
                    var svg = el.querySelector('svg');
                    if (svg) {
                        svg.setAttribute('width', data.size);
                        svg.setAttribute('height', data.size);
                    }
                }
            } else if (editType === 'map') {
                if (data.address) {
                    var iframe = el.querySelector('iframe');
                    if (iframe) {
                        iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(data.address) + '&t=&z=15&ie=UTF8&iwloc=&output=embed';
                    }
                }
            } else if (editType === 'bgcolor') {
                if (data.bgColor) {
                    var opacity = data.bgOpacity !== undefined ? data.bgOpacity : 1;
                    var r = parseInt(data.bgColor.slice(1,3), 16);
                    var g = parseInt(data.bgColor.slice(3,5), 16);
                    var b = parseInt(data.bgColor.slice(5,7), 16);
                    var bgTarget = el.getAttribute('data-edit-target') === 'parent' ? el.parentElement : el;
                    if (bgTarget) bgTarget.style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
                }
            } else if (editType === 'logo') {
                if (data.useImage && data.logoSrc) {
                    var h = data.logoHeight || '28px';
                    var br = data.logoBorderRadius ? 'border-radius:' + data.logoBorderRadius + '%;' : '';
                    el.innerHTML = '<img src="' + data.logoSrc + '" alt="Logo" style="height:' + h + ';width:auto;display:inline-block;' + br + '">';
                } else {
                    if (data.text !== undefined) el.textContent = data.text;
                    if (data.color) el.style.color = data.color;
                    if (data.fontSize) el.style.fontSize = data.fontSize;
                    if (data.fontFamily) {
                        el.style.fontFamily = data.fontFamily;
                        var fontObj2 = CONFIG.fonts.find(function (f) { return f.family === data.fontFamily; });
                        if (fontObj2) loadFont(fontObj2.name);
                    }
                }
            }
        });
    }

    // ═══════════════════════════════════════════════════
    //  UI CREATION
    // ═══════════════════════════════════════════════════

    function createUI() {
        // Toggle button
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'te-toggle';
        toggleBtn.title = 'Editor öffnen';
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Seite bearbeiten</span>';
        toggleBtn.addEventListener('click', toggleEditor);
        document.body.appendChild(toggleBtn);

        // Overlay
        overlay = document.createElement('div');
        overlay.className = 'te-overlay';
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);

        // Sidebar
        sidebar = document.createElement('div');
        sidebar.className = 'te-sidebar';
        sidebar.innerHTML =
            '<div class="te-sidebar-header">' +
            '  <h3><span class="te-title-text">Element bearbeiten</span> <span class="te-el-type"></span></h3>' +
            '  <button class="te-close" title="Schliessen">' +
            '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '  </button>' +
            '</div>' +
            '<div class="te-sidebar-body" id="teSidebarBody"></div>' +
            '<div class="te-sidebar-footer">' +
            '  <button class="te-btn te-btn-reset" id="teReset">Zurücksetzen</button>' +
            '  <button class="te-btn te-btn-save" id="teSave">Speichern</button>' +
            '</div>';
        document.body.appendChild(sidebar);

        sidebar.querySelector('.te-close').addEventListener('click', closeSidebar);
        sidebar.querySelector('#teSave').addEventListener('click', handleSave);
        sidebar.querySelector('#teReset').addEventListener('click', handleReset);

        // Toast
        toast = document.createElement('div');
        toast.className = 'te-toast';
        document.body.appendChild(toast);

        // ESC key to close editor / sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar.classList.contains('te-open')) {
                    closeSidebar();
                } else if (isEditing) {
                    toggleEditor();
                }
            }
        });
    }

    // ═══════════════════════════════════════════════════
    //  BADGES — injected edit indicators
    // ═══════════════════════════════════════════════════

    var PENCIL_SVG = '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
    var UPLOAD_SVG = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
    var LOGO_SVG = '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    function injectBadges() {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            if (el.querySelector('.te-badge')) return;
            var editType = el.getAttribute('data-edit');
            var badge = document.createElement('div');
            badge.className = 'te-badge' + (editType === 'image' ? ' te-badge--image' : '');
            var icon = editType === 'image' ? UPLOAD_SVG : (editType === 'logo' ? LOGO_SVG : PENCIL_SVG);
            badge.innerHTML = icon;

            // For bg-image divs (position:absolute like hero-bg), make badge always visible & clickable
            var cs = getComputedStyle(el);
            var isBgElement = (editType === 'image' && el.tagName !== 'IMG' && cs.position === 'absolute');

            if (isBgElement) {
                // Place badge on the parent section instead
                var parent = el.parentElement;
                badge.style.cssText = 'position:absolute;top:16px;right:16px;z-index:200;opacity:1;pointer-events:auto;cursor:pointer;';
                badge.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    currentElement = el;
                    currentKey = el.getAttribute('data-edit-key');
                    openImageEditor(el);
                });
                var parentPos = getComputedStyle(parent).position;
                if (parentPos === 'static') parent.style.position = 'relative';
                parent.appendChild(badge);
            } else if (el.tagName === 'IMG') {
                // IMG can't have children — put badge on parent
                var imgParent = el.parentElement;
                var imgParentPos = getComputedStyle(imgParent).position;
                if (imgParentPos === 'static') imgParent.style.position = 'relative';
                badge.style.cssText = 'position:absolute;top:8px;right:8px;z-index:200;opacity:0.7;pointer-events:auto;cursor:pointer;';
                badge.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    currentElement = el;
                    currentKey = el.getAttribute('data-edit-key');
                    openImageEditor(el);
                });
                imgParent.appendChild(badge);
            } else {
                // Normal inline element
                if (cs.position === 'static') el.style.position = 'relative';
                el.classList.add('te-has-badge');
                el.appendChild(badge);
            }
        });
    }

    function removeBadges() {
        document.querySelectorAll('.te-badge').forEach(function (b) {
            b.remove();
        });
        document.querySelectorAll('.te-has-badge').forEach(function (el) {
            el.classList.remove('te-has-badge');
        });
    }

    // ═══════════════════════════════════════════════════
    //  TOGGLE EDITOR
    // ═══════════════════════════════════════════════════

    function toggleEditor() {
        // If not authenticated and trying to enter edit mode, show auth prompt
        if (!isEditing && !isAuthenticated) {
            showAuthPrompt();
            return;
        }

        isEditing = !isEditing;
        document.body.classList.toggle('te-editing', isEditing);
        toggleBtn.classList.toggle('te-active', isEditing);
        if (statusBar) statusBar.classList.toggle('te-show', isEditing);

        if (isEditing) {
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Bearbeitung beenden</span>';
            toggleBtn.title = 'Editor schliessen';
            injectBadges();
            bindEditableClicks();
        } else {
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Seite bearbeiten</span>';
            toggleBtn.title = 'Editor öffnen';
            removeBadges();
            unbindEditableClicks();
            closeSidebar();
        }
    }

    // ═══════════════════════════════════════════════════
    //  AUTH PROMPT
    // ═══════════════════════════════════════════════════

    function showAuthPrompt() {
        // Check sessionStorage first
        if (sessionStorage.getItem('te_auth') === '1') {
            isAuthenticated = true;
            toggleEditor();
            return;
        }

        // Create modal overlay
        var authOverlay = document.createElement('div');
        authOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;';

        var authBox = document.createElement('div');
        authBox.style.cssText = 'background:#fff;border-radius:16px;padding:32px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center;font-family:var(--sans,sans-serif);';

        var title = document.createElement('h3');
        title.textContent = 'Editor-Zugang';
        title.style.cssText = 'margin:0 0 8px;font-size:20px;color:#1a1a1a;';

        var desc = document.createElement('p');
        desc.textContent = 'Bitte geben Sie den Zugangscode ein:';
        desc.style.cssText = 'margin:0 0 20px;font-size:14px;color:#666;';

        var input = document.createElement('input');
        input.type = 'password';
        input.placeholder = 'Zugangscode';
        input.style.cssText = 'width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px;outline:none;box-sizing:border-box;transition:border-color 0.2s;';
        input.addEventListener('focus', function() { input.style.borderColor = '#c9a96e'; });
        input.addEventListener('blur', function() { input.style.borderColor = '#e0e0e0'; });

        var errorMsg = document.createElement('p');
        errorMsg.style.cssText = 'margin:8px 0 0;font-size:13px;color:#e53935;display:none;';

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:10px;margin-top:20px;';

        var cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.style.cssText = 'flex:1;padding:12px;border:2px solid #e0e0e0;border-radius:10px;background:#fff;font-size:14px;cursor:pointer;color:#666;';
        cancelBtn.addEventListener('click', function() { authOverlay.remove(); });

        var submitBtn = document.createElement('button');
        submitBtn.textContent = 'Bestätigen';
        submitBtn.style.cssText = 'flex:1;padding:12px;border:none;border-radius:10px;background:#c9a96e;color:#fff;font-size:14px;font-weight:600;cursor:pointer;';

        function doAuth() {
            var code = input.value.trim();
            if (!code) return;
            submitBtn.disabled = true;
            submitBtn.textContent = '...';

            var endpoint = CONFIG.apiEndpoint || '/api/';
            fetch(endpoint + 'auth-editor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    isAuthenticated = true;
                    sessionStorage.setItem('te_auth', '1');
                    authOverlay.remove();
                    toggleEditor();
                } else {
                    errorMsg.textContent = 'Falscher Code. Bitte versuchen Sie es erneut.';
                    errorMsg.style.display = 'block';
                    input.style.borderColor = '#e53935';
                    input.value = '';
                    input.focus();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Bestätigen';
                }
            })
            .catch(function() {
                errorMsg.textContent = 'Fehler bei der Verbindung. Bitte versuchen Sie es erneut.';
                errorMsg.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Bestätigen';
            });
        }

        submitBtn.addEventListener('click', doAuth);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') doAuth();
        });

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(submitBtn);
        authBox.appendChild(title);
        authBox.appendChild(desc);
        authBox.appendChild(input);
        authBox.appendChild(errorMsg);
        authBox.appendChild(btnRow);
        authOverlay.appendChild(authBox);
        document.body.appendChild(authOverlay);

        setTimeout(function() { input.focus(); }, 100);
    }

    // ═══════════════════════════════════════════════════
    //  EDITABLE ELEMENT CLICK HANDLING
    // ═══════════════════════════════════════════════════

    function onEditableClick(e) {
        if (!isEditing) return;
        e.preventDefault();
        e.stopPropagation();

        var el = e.currentTarget;
        currentElement = el;
        currentKey = el.getAttribute('data-edit-key');
        var editType = el.getAttribute('data-edit');

        if (editType === 'text') {
            openTextEditor(el);
        } else if (editType === 'image') {
            openImageEditor(el);
        } else if (editType === 'logo') {
            openLogoEditor(el);
        } else if (editType === 'bgcolor') {
            openBgColorEditor(el);
        } else if (editType === 'map') {
            openMapEditor(el);
        } else if (editType === 'link') {
            openLinkEditor(el);
        }
    }

    function bindEditableClicks() {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            el.addEventListener('click', onEditableClick, false);
        });
    }

    function unbindEditableClicks() {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            el.removeEventListener('click', onEditableClick, false);
        });
    }

    // ═══════════════════════════════════════════════════
    //  TEXT EDITOR
    // ═══════════════════════════════════════════════════

    function openTextEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentText = data.text !== undefined ? data.text : el.textContent.trim();
        var currentColor = data.color || getComputedStyle(el).color;
        var currentSize = data.fontSize || getComputedStyle(el).fontSize;
        var currentFontFamily = data.fontFamily || '';

        // Convert rgb to hex
        var hexColor = rgbToHex(currentColor);
        var sizeNum = parseInt(currentSize) || 16;

        sidebar.querySelector('.te-el-type').textContent = 'Text';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Inhalt</label>' +
            '  <textarea class="te-textarea" id="teText">' + escapeHtml(currentText) + '</textarea>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Farbe</label>' +
            '  <div class="te-color-row">' +
            '    <input type="color" class="te-color-picker" id="teColor" value="' + hexColor + '">' +
            '    <input type="text" class="te-color-hex" id="teColorHex" value="' + hexColor + '" maxlength="7">' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Schriftgrösse</label>' +
            '  <div class="te-size-row">' +
            '    <input type="range" class="te-range" id="teSize" min="10" max="120" value="' + sizeNum + '">' +
            '    <span class="te-size-val" id="teSizeVal">' + sizeNum + 'px</span>' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Schriftart</label>' +
            '  <select class="te-select" id="teFont">' +
            '    <option value="">— Original —</option>' +
            buildFontOptions(currentFontFamily) +
            '  </select>' +
            '</div>';

        // Live preview bindings
        var textArea = body.querySelector('#teText');
        var colorPicker = body.querySelector('#teColor');
        var colorHex = body.querySelector('#teColorHex');
        var sizeRange = body.querySelector('#teSize');
        var sizeVal = body.querySelector('#teSizeVal');
        var fontSelect = body.querySelector('#teFont');

        textArea.addEventListener('input', function () {
            el.textContent = this.value;
        });

        colorPicker.addEventListener('input', function () {
            el.style.color = this.value;
            colorHex.value = this.value;
        });

        colorHex.addEventListener('input', function () {
            if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
                el.style.color = this.value;
                colorPicker.value = this.value;
            }
        });

        sizeRange.addEventListener('input', function () {
            el.style.fontSize = this.value + 'px';
            sizeVal.textContent = this.value + 'px';
        });

        fontSelect.addEventListener('change', function () {
            if (this.value) {
                var font = CONFIG.fonts.find(function (f) { return f.family === fontSelect.value; });
                if (font) loadFont(font.name);
                el.style.fontFamily = this.value;
            } else {
                el.style.fontFamily = '';
            }
        });

        openSidebar();
    }

    function buildFontOptions(currentFamily) {
        return CONFIG.fonts.map(function (f) {
            var selected = f.family === currentFamily ? ' selected' : '';
            return '<option value="' + f.family + '"' + selected + ' style="font-family:' + f.family + '">' + f.name + '</option>';
        }).join('');
    }

    // ═══════════════════════════════════════════════════
    //  IMAGE EDITOR
    // ═══════════════════════════════════════════════════

    function openImageEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentSrc = '';
        var isImg = el.tagName === 'IMG';

        if (isImg) {
            currentSrc = data.src || el.src;
        } else {
            var bgImg = getComputedStyle(el).backgroundImage;
            currentSrc = data.src || (bgImg && bgImg !== 'none' ? bgImg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') : '');
        }

        var currentHeight = data.height || parseInt(getComputedStyle(isImg ? el : el).height) || 300;
        var targetForRadius = isImg ? el.parentElement : el;
        var currentRadius = data.borderRadius !== undefined ? data.borderRadius : parseInt(getComputedStyle(targetForRadius).borderRadius) || 0;

        sidebar.querySelector('.te-el-type').textContent = 'Bild';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Vorschau</label>' +
            '  <div class="te-img-preview" id="teImgPreview">' +
            (currentSrc ? '<img src="' + currentSrc + '" alt="Preview">' : '<span style="color:#94a3b8;font-size:14px">Kein Bild</span>') +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Höhe (px)</label>' +
            '  <div class="te-size-row">' +
            '    <input type="range" class="te-range" id="teImgHeight" min="100" max="800" value="' + currentHeight + '">' +
            '    <span class="te-size-val" id="teImgHeightVal">' + currentHeight + 'px</span>' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Rundung (border-radius)</label>' +
            '  <div class="te-size-row">' +
            '    <input type="range" class="te-range" id="teImgRadius" min="0" max="50" value="' + currentRadius + '">' +
            '    <span class="te-size-val" id="teImgRadiusVal">' + currentRadius + '%</span>' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Bild hochladen</label>' +
            '  <label class="te-upload-btn" for="teUpload">' +
            '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
            '    Bild auswählen' +
            '  </label>' +
            '  <input type="file" class="te-upload-input" id="teUpload" accept="image/*">' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Oder Bild-URL eingeben</label>' +
            '  <input type="text" class="te-input" id="teImgUrl" placeholder="https://..." value="' + (currentSrc.startsWith('data:') ? '' : escapeHtml(currentSrc)) + '">' +
            '</div>';

        var fileInput = body.querySelector('#teUpload');
        var urlInput = body.querySelector('#teImgUrl');
        var preview = body.querySelector('#teImgPreview');
        var heightRange = body.querySelector('#teImgHeight');
        var heightVal = body.querySelector('#teImgHeightVal');

        heightRange.addEventListener('input', function () {
            var h = this.value + 'px';
            heightVal.textContent = h;
            if (isImg) {
                el.style.height = h;
                el.style.objectFit = 'cover';
            } else {
                el.style.height = h;
            }
        });

        var radiusRange = body.querySelector('#teImgRadius');
        var radiusVal = body.querySelector('#teImgRadiusVal');
        radiusRange.addEventListener('input', function () {
            var r = this.value + '%';
            radiusVal.textContent = r;
            targetForRadius.style.borderRadius = r;
            if (isImg) el.style.borderRadius = r;
        });

        fileInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            // Show local preview immediately
            var localReader = new FileReader();
            localReader.onload = function (ev) {
                preview.innerHTML = '<img src="' + ev.target.result + '" alt="Preview">';
            };
            localReader.readAsDataURL(file);
            // Upload to server and apply the server URL
            uploadFile(file, function (url) {
                applyImage(el, url);
                urlInput.value = '';
            });
        });

        urlInput.addEventListener('input', debounce(function () {
            var url = urlInput.value.trim();
            if (url) {
                preview.innerHTML = '<img src="' + url + '" alt="Preview">';
                applyImage(el, url);
            }
        }, 500));

        openSidebar();
    }

    // ═══════════════════════════════════════════════════
    //  LOGO EDITOR (text + image upload)
    // ═══════════════════════════════════════════════════

    function openLogoEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentText = data.text !== undefined ? data.text : el.textContent.trim();
        var currentColor = data.color || getComputedStyle(el).color;
        var currentSize = data.fontSize || getComputedStyle(el).fontSize;
        var currentFontFamily = data.fontFamily || '';
        var currentLogoSrc = data.logoSrc || '';
        var useImage = data.useImage || false;

        var hexColor = rgbToHex(currentColor);
        var sizeNum = parseInt(currentSize) || 24;

        sidebar.querySelector('.te-el-type').textContent = 'Logo';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Logo-Typ</label>' +
            '  <div style="display:flex;gap:8px;margin-bottom:12px">' +
            '    <button class="te-btn ' + (!useImage ? 'te-btn-save' : 'te-btn-reset') + '" id="teLogoText" style="flex:1;padding:10px">Text</button>' +
            '    <button class="te-btn ' + (useImage ? 'te-btn-save' : 'te-btn-reset') + '" id="teLogoImg" style="flex:1;padding:10px">Bild hochladen</button>' +
            '  </div>' +
            '</div>' +
            '<div id="teLogoTextPanel"' + (useImage ? ' style="display:none"' : '') + '>' +
            '  <div class="te-group">' +
            '    <label>Text</label>' +
            '    <input type="text" class="te-input" id="teLogoName" value="' + escapeHtml(currentText) + '">' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Farbe</label>' +
            '    <div class="te-color-row">' +
            '      <input type="color" class="te-color-picker" id="teLogoColor" value="' + hexColor + '">' +
            '      <input type="text" class="te-color-hex" id="teLogoColorHex" value="' + hexColor + '" maxlength="7">' +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Schriftgrösse</label>' +
            '    <div class="te-size-row">' +
            '      <input type="range" class="te-range" id="teLogoSize" min="14" max="60" value="' + sizeNum + '">' +
            '      <span class="te-size-val" id="teLogoSizeVal">' + sizeNum + 'px</span>' +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Schriftart</label>' +
            '    <select class="te-select" id="teLogoFont">' +
            '      <option value="">— Original —</option>' +
            buildFontOptions(currentFontFamily) +
            '    </select>' +
            '  </div>' +
            '</div>' +
            '<div id="teLogoImgPanel"' + (!useImage ? ' style="display:none"' : '') + '>' +
            '  <div class="te-group">' +
            '    <label>Logo-Bild</label>' +
            '    <div class="te-img-preview" id="teLogoPreview" style="height:100px;background:#f4f7fb">' +
            (currentLogoSrc ? '<img src="' + currentLogoSrc + '" alt="Logo" style="object-fit:contain">' : '<span style="color:#94a3b8;font-size:14px">Kein Bild</span>') +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Logo hochladen</label>' +
            '    <label class="te-upload-btn" for="teLogoUpload">' +
            '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
            '      Bild auswählen' +
            '    </label>' +
            '    <input type="file" class="te-upload-input" id="teLogoUpload" accept="image/*">' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Logo-Grösse</label>' +
            '    <div class="te-size-row">' +
            '      <input type="range" class="te-range" id="teLogoImgSize" min="16" max="120" value="' + (parseInt(data.logoHeight) || sizeNum) + '">' +
            '      <span class="te-size-val" id="teLogoImgSizeVal">' + (parseInt(data.logoHeight) || sizeNum) + 'px</span>' +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Rundung (border-radius)</label>' +
            '    <div class="te-size-row">' +
            '      <input type="range" class="te-range" id="teLogoBorderRadius" min="0" max="50" value="' + (data.logoBorderRadius || 0) + '">' +
            '      <span class="te-size-val" id="teLogoBorderRadiusVal">' + (data.logoBorderRadius || 0) + '%</span>' +
            '    </div>' +
            '  </div>' +
            '</div>';

        var textPanel = body.querySelector('#teLogoTextPanel');
        var imgPanel = body.querySelector('#teLogoImgPanel');
        var btnText = body.querySelector('#teLogoText');
        var btnImg = body.querySelector('#teLogoImg');
        var preview = body.querySelector('#teLogoPreview');
        var tempLogoSrc = currentLogoSrc || '';

        btnText.addEventListener('click', function() {
            textPanel.style.display = '';
            imgPanel.style.display = 'none';
            btnText.className = 'te-btn te-btn-save';
            btnImg.className = 'te-btn te-btn-reset';
            el.innerHTML = '';
            el.textContent = body.querySelector('#teLogoName').value;
            el.style.backgroundImage = '';
            el.style.fontSize = '';
        });

        btnImg.addEventListener('click', function() {
            textPanel.style.display = 'none';
            imgPanel.style.display = '';
            btnImg.className = 'te-btn te-btn-save';
            btnText.className = 'te-btn te-btn-reset';
            if (tempLogoSrc) {
                var h = body.querySelector('#teLogoImgSize') ? body.querySelector('#teLogoImgSize').value : sizeNum;
                el.innerHTML = '<img src="' + tempLogoSrc + '" alt="Logo" style="height:' + h + 'px;width:auto;display:inline-block">';
                preview.innerHTML = '<img src="' + tempLogoSrc + '" alt="Logo" style="object-fit:contain">';
            }
        });

        // Text bindings
        var nameInput = body.querySelector('#teLogoName');
        var colorPicker = body.querySelector('#teLogoColor');
        var colorHex = body.querySelector('#teLogoColorHex');
        var sizeRange = body.querySelector('#teLogoSize');
        var sizeVal = body.querySelector('#teLogoSizeVal');
        var fontSelect = body.querySelector('#teLogoFont');

        nameInput.addEventListener('input', function() { el.textContent = this.value; });
        colorPicker.addEventListener('input', function() { el.style.color = this.value; colorHex.value = this.value; });
        colorHex.addEventListener('input', function() {
            if (/^#[0-9a-fA-F]{6}$/.test(this.value)) { el.style.color = this.value; colorPicker.value = this.value; }
        });
        sizeRange.addEventListener('input', function() { el.style.fontSize = this.value + 'px'; sizeVal.textContent = this.value + 'px'; });
        fontSelect.addEventListener('change', function() {
            if (this.value) {
                var font = CONFIG.fonts.find(function(f) { return f.family === fontSelect.value; });
                if (font) loadFont(font.name);
                el.style.fontFamily = this.value;
            } else { el.style.fontFamily = ''; }
        });

        // Image upload
        var fileInput = body.querySelector('#teLogoUpload');

        fileInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;
            // Show local preview immediately
            var localReader = new FileReader();
            localReader.onload = function(ev) {
                preview.innerHTML = '<img src="' + ev.target.result + '" alt="Logo" style="object-fit:contain">';
            };
            localReader.readAsDataURL(file);
            // Upload to server and apply the server URL
            uploadFile(file, function(src) {
                tempLogoSrc = src;
                var imgSize = body.querySelector('#teLogoImgSize');
                var h = imgSize ? imgSize.value : sizeNum;
                el.innerHTML = '<img src="' + src + '" alt="Logo" style="height:' + h + 'px;width:auto;display:inline-block">';
            });
        });

        // Logo image size slider
        var logoImgSize = body.querySelector('#teLogoImgSize');
        var logoImgSizeVal = body.querySelector('#teLogoImgSizeVal');
        logoImgSize.addEventListener('input', function() {
            logoImgSizeVal.textContent = this.value + 'px';
            var logoImg = el.querySelector('img');
            if (logoImg) {
                logoImg.style.height = this.value + 'px';
            }
        });

        // Logo border-radius slider
        var logoBorderRadius = body.querySelector('#teLogoBorderRadius');
        var logoBorderRadiusVal = body.querySelector('#teLogoBorderRadiusVal');
        logoBorderRadius.addEventListener('input', function() {
            logoBorderRadiusVal.textContent = this.value + '%';
            var logoImg = el.querySelector('img');
            if (logoImg) {
                logoImg.style.borderRadius = this.value + '%';
            }
        });

        openSidebar();
    }

    function resizeImage(file, maxWidth, maxHeight, quality, callback) {
        var reader = new FileReader();
        reader.onload = function (ev) {
            var img = new Image();
            img.onload = function () {
                var w = img.width;
                var h = img.height;
                if (w > maxWidth || h > maxHeight) {
                    var ratio = Math.min(maxWidth / w, maxHeight / h);
                    w = Math.round(w * ratio);
                    h = Math.round(h * ratio);
                }
                var canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(function (blob) {
                    callback(blob);
                }, 'image/jpeg', quality);
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }

    function uploadFile(file, callback) {
        // Resize on frontend first (max 1200px, quality 0.8)
        resizeImage(file, 1200, 1200, 0.8, function (resizedBlob) {
            if (!CONFIG.useApi || !CONFIG.apiEndpoint) {
                // Fallback to base64 if no API
                var reader = new FileReader();
                reader.onload = function (ev) { callback(ev.target.result); };
                reader.readAsDataURL(resizedBlob);
                return;
            }
            var formData = new FormData();
            formData.append('image', resizedBlob, 'image.jpg');
            formData.append('field', currentKey || 'image');
            fetch(CONFIG.apiEndpoint + 'upload', {
                method: 'POST',
                body: formData
            })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.path) {
                    callback(data.path);
                } else {
                    console.error('[Editor] Upload failed, using resized base64');
                    // Fallback to resized base64
                    var reader = new FileReader();
                    reader.onload = function (ev) { callback(ev.target.result); };
                    reader.readAsDataURL(resizedBlob);
                }
            })
            .catch(function (err) {
                console.error('[Editor] Upload error, using resized base64:', err);
                // Fallback to resized base64
                var reader = new FileReader();
                reader.onload = function (ev) { callback(ev.target.result); };
                reader.readAsDataURL(resizedBlob);
            });
        });
    }

    function applyImage(el, src) {
        if (el.tagName === 'IMG') {
            el.src = src;
        } else {
            // Use background shorthand to override CSS background shorthand
            el.style.background = "url('" + src + "') center/cover no-repeat";
        }
    }

    // ═══════════════════════════════════════════════════
    //  LINK EDITOR
    // ═══════════════════════════════════════════════════

    function openLinkEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentHref = data.href || el.href || '';
        if (currentHref === '#' || currentHref.endsWith('/#')) currentHref = '';
        var label = el.getAttribute('aria-label') || currentKey;
        var currentColor = data.color || getComputedStyle(el).color;
        var hexColor = rgbToHex(currentColor);
        var svg = el.querySelector('svg');
        var currentSize = data.size || (svg ? svg.getAttribute('width') : '18') || '18';
        var sizeNum = parseInt(currentSize) || 18;

        sidebar.querySelector('.te-el-type').textContent = 'Link';
        sidebar.querySelector('.te-title-text').textContent = label;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>' + escapeHtml(label) + ' — URL</label>' +
            '  <input type="text" class="te-input" id="teLinkUrl" value="' + escapeHtml(currentHref) + '" placeholder="https://instagram.com/dein-profil">' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Farbe</label>' +
            '  <div class="te-color-row">' +
            '    <input type="color" class="te-color-picker" id="teLinkColor" value="' + hexColor + '">' +
            '    <input type="text" class="te-color-hex" id="teLinkColorHex" value="' + hexColor + '" maxlength="7">' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Grösse <span id="teLinkSizeVal">' + sizeNum + 'px</span></label>' +
            '  <input type="range" class="te-range" id="teLinkSize" min="12" max="60" value="' + sizeNum + '">' +
            '</div>' +
            '<div class="te-group" style="font-size:13px;color:#6b7d99">' +
            '  <p>Der Link öffnet sich in einem neuen Tab.</p>' +
            '</div>';

        var colorPicker = body.querySelector('#teLinkColor');
        var colorHex = body.querySelector('#teLinkColorHex');
        var sizeRange = body.querySelector('#teLinkSize');
        var sizeVal = body.querySelector('#teLinkSizeVal');
        var isBgColor = el.getAttribute('data-edit-color-target') === 'background';
        colorPicker.addEventListener('input', function() {
            colorHex.value = colorPicker.value;
            if (isBgColor) { el.style.backgroundColor = colorPicker.value; } else { el.style.color = colorPicker.value; }
        });
        colorHex.addEventListener('input', function() {
            if (/^#[0-9a-fA-F]{6}$/.test(colorHex.value)) {
                colorPicker.value = colorHex.value;
                if (isBgColor) { el.style.backgroundColor = colorHex.value; } else { el.style.color = colorHex.value; }
            }
        });
        sizeRange.addEventListener('input', function() {
            var s = sizeRange.value;
            sizeVal.textContent = s + 'px';
            var svgEl = el.querySelector('svg');
            if (svgEl) {
                svgEl.setAttribute('width', s);
                svgEl.setAttribute('height', s);
            }
        });

        openSidebar();
    }

    // ═══════════════════════════════════════════════════
    //  MAP EDITOR
    // ═══════════════════════════════════════════════════

    function openMapEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentAddress = data.address || 'Bahnhofstrasse 15, 8001 Zürich';

        sidebar.querySelector('.te-el-type').textContent = 'Karte';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Adresse eingeben</label>' +
            '  <input type="text" class="te-input" id="teMapAddress" value="' + escapeHtml(currentAddress) + '" placeholder="Strasse, PLZ, Stadt">' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Vorschau</label>' +
            '  <iframe id="teMapPreview" src="https://maps.google.com/maps?q=' + encodeURIComponent(currentAddress) + '&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="200" style="border:0;border-radius:10px" allowfullscreen loading="lazy"></iframe>' +
            '</div>';

        var addressInput = body.querySelector('#teMapAddress');
        var mapPreview = body.querySelector('#teMapPreview');

        addressInput.addEventListener('input', debounce(function () {
            var addr = addressInput.value.trim();
            if (addr) {
                mapPreview.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(addr) + '&t=&z=15&ie=UTF8&iwloc=&output=embed';
            }
        }, 800));

        openSidebar();
    }

    // ═══════════════════════════════════════════════════
    //  BACKGROUND COLOR EDITOR
    // ═══════════════════════════════════════════════════

    function openBgColorEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var bgTarget = el.getAttribute('data-edit-target') === 'parent' ? el.parentElement : el;
        var computedBg = getComputedStyle(bgTarget).backgroundColor;
        var defaultColor = rgbToHex(computedBg);
        var defaultOpacity = 1;
        var rgbaMatch = computedBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch && rgbaMatch[4] !== undefined) {
            defaultOpacity = parseFloat(rgbaMatch[4]);
        }
        var currentColor = data.bgColor || defaultColor;
        var currentOpacity = data.bgOpacity !== undefined ? data.bgOpacity : defaultOpacity;

        sidebar.querySelector('.te-el-type').textContent = 'Hintergrund';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Farbe</label>' +
            '  <div class="te-color-row">' +
            '    <input type="color" class="te-color-picker" id="teBgColor" value="' + currentColor + '">' +
            '    <input type="text" class="te-color-hex" id="teBgColorHex" value="' + currentColor + '" maxlength="7">' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Transparenz</label>' +
            '  <div class="te-size-row">' +
            '    <input type="range" class="te-range" id="teBgOpacity" min="0" max="100" value="' + Math.round(currentOpacity * 100) + '">' +
            '    <span class="te-size-val" id="teBgOpacityVal">' + Math.round(currentOpacity * 100) + '%</span>' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Vorschau</label>' +
            '  <div id="teBgPreview" style="width:100%;height:60px;border-radius:10px;border:1px solid #e2e8f0;background-color:' + currentColor + ';opacity:' + currentOpacity + '"></div>' +
            '</div>';

        var colorPicker = body.querySelector('#teBgColor');
        var colorHex = body.querySelector('#teBgColorHex');
        var opacityRange = body.querySelector('#teBgOpacity');
        var opacityVal = body.querySelector('#teBgOpacityVal');
        var preview = body.querySelector('#teBgPreview');

        function applyBgLive() {
            var hex = colorPicker.value;
            var op = parseInt(opacityRange.value) / 100;
            var r = parseInt(hex.slice(1,3), 16);
            var g = parseInt(hex.slice(3,5), 16);
            var b = parseInt(hex.slice(5,7), 16);
            var liveTarget = el.getAttribute('data-edit-target') === 'parent' ? el.parentElement : el;
            if (liveTarget) liveTarget.style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
            preview.style.backgroundColor = hex;
            preview.style.opacity = op;
        }

        colorPicker.addEventListener('input', function () {
            colorHex.value = this.value;
            applyBgLive();
        });
        colorHex.addEventListener('input', function () {
            if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
                colorPicker.value = this.value;
                applyBgLive();
            }
        });
        opacityRange.addEventListener('input', function () {
            opacityVal.textContent = this.value + '%';
            applyBgLive();
        });

        openSidebar();
    }

    // ═══════════════════════════════════════════════════
    //  SIDEBAR CONTROLS
    // ═══════════════════════════════════════════════════

    function openSidebar() {
        sidebar.classList.add('te-open');
        overlay.classList.add('te-show');
    }

    function closeSidebar() {
        sidebar.classList.remove('te-open');
        overlay.classList.remove('te-show');
        currentElement = null;
        currentKey = null;
    }

    function handleSave() {
        if (!currentElement || !currentKey) return;

        var editType = currentElement.getAttribute('data-edit');

        if (editType === 'text') {
            var textArea = sidebar.querySelector('#teText');
            var colorPicker = sidebar.querySelector('#teColor');
            var sizeRange = sidebar.querySelector('#teSize');
            var fontSelect = sidebar.querySelector('#teFont');

            savedData[currentKey] = {
                text: textArea ? textArea.value : '',
                color: colorPicker ? colorPicker.value : '',
                fontSize: sizeRange ? sizeRange.value + 'px' : '',
                fontFamily: fontSelect ? fontSelect.value : ''
            };
        } else if (editType === 'image') {
            var imgEl = currentElement.tagName === 'IMG' ? currentElement : null;
            var bgEl = !imgEl ? currentElement : null;
            var src = '';

            if (imgEl) {
                src = imgEl.src;
            } else if (bgEl) {
                var bg = getComputedStyle(bgEl).backgroundImage;
                if (bg && bg !== 'none') {
                    src = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                }
            }

            var imgHeightInput = sidebar.querySelector('#teImgHeight');
            var imgRadiusInput = sidebar.querySelector('#teImgRadius');
            console.log('[Editor] Saving image for', currentKey, '| src type:', src.substring(0, 30) + '...', '| src length:', src.length);
            savedData[currentKey] = {
                src: src,
                height: imgHeightInput ? parseInt(imgHeightInput.value) : null,
                borderRadius: imgRadiusInput ? parseInt(imgRadiusInput.value) : null
            };
        } else if (editType === 'logo') {
            var logoTextPanel = sidebar.querySelector('#teLogoTextPanel');
            var isImageMode = logoTextPanel && logoTextPanel.style.display === 'none';
            var logoImg = currentElement.querySelector('img');

            if (isImageMode && logoImg) {
                var logoBR = sidebar.querySelector('#teLogoBorderRadius');
                savedData[currentKey] = {
                    useImage: true,
                    logoSrc: logoImg.src,
                    logoHeight: (sidebar.querySelector('#teLogoImgSize') ? sidebar.querySelector('#teLogoImgSize').value : '24') + 'px',
                    logoBorderRadius: logoBR ? parseInt(logoBR.value) : 0
                };
            } else {
                var nameInput = sidebar.querySelector('#teLogoName');
                var colorP = sidebar.querySelector('#teLogoColor');
                var sizeR = sidebar.querySelector('#teLogoSize');
                var fontS = sidebar.querySelector('#teLogoFont');
                savedData[currentKey] = {
                    useImage: false,
                    text: nameInput ? nameInput.value : '',
                    color: colorP ? colorP.value : '',
                    fontSize: sizeR ? sizeR.value + 'px' : '',
                    fontFamily: fontS ? fontS.value : ''
                };
            }
        } else if (editType === 'link') {
            var linkUrl = sidebar.querySelector('#teLinkUrl');
            var linkColor = sidebar.querySelector('#teLinkColor');
            var linkSize = sidebar.querySelector('#teLinkSize');
            var href = linkUrl ? linkUrl.value.trim() : '';
            var color = linkColor ? linkColor.value : '';
            var size = linkSize ? linkSize.value : '';
            savedData[currentKey] = { href: href, color: color, size: size };
            if (href) {
                currentElement.href = href;
                currentElement.target = '_blank';
                currentElement.rel = 'noopener noreferrer';
            }
            if (color) {
                if (currentElement.getAttribute('data-edit-color-target') === 'background') {
                    currentElement.style.backgroundColor = color;
                } else {
                    currentElement.style.color = color;
                }
            }
            if (size) {
                var svgEl = currentElement.querySelector('svg');
                if (svgEl) {
                    svgEl.setAttribute('width', size);
                    svgEl.setAttribute('height', size);
                }
            }
        } else if (editType === 'map') {
            var mapAddress = sidebar.querySelector('#teMapAddress');
            savedData[currentKey] = {
                address: mapAddress ? mapAddress.value.trim() : ''
            };
            // Update the iframe on the page
            var iframe = currentElement.querySelector('iframe');
            if (iframe && mapAddress) {
                iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(mapAddress.value.trim()) + '&t=&z=15&ie=UTF8&iwloc=&output=embed';
            }
        } else if (editType === 'bgcolor') {
            var bgColorPicker = sidebar.querySelector('#teBgColor');
            var bgOpacityRange = sidebar.querySelector('#teBgOpacity');
            savedData[currentKey] = {
                bgColor: bgColorPicker ? bgColorPicker.value : '#1a1a1a',
                bgOpacity: bgOpacityRange ? parseInt(bgOpacityRange.value) / 100 : 1
            };
        }

        // Show loader on save button
        var saveBtn = sidebar.querySelector('#teSave');
        var saveBtnOriginal = saveBtn ? saveBtn.innerHTML : 'Speichern';
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<svg class="te-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>';
        }

        saveData(function () {
            if (saveBtn) {
                saveBtn.innerHTML = saveBtnOriginal;
                saveBtn.disabled = false;
            }
            closeSidebar();
        });
    }

    function handleReset() {
        if (!currentKey) return;
        if (!confirm('Dieses Element auf den Originalzustand zurücksetzen?')) return;

        delete savedData[currentKey];
        saveData(function () {
            // Reload the page to restore original
            location.reload();
        });
    }

    // ═══════════════════════════════════════════════════
    //  TOAST
    // ═══════════════════════════════════════════════════

    var toastTimer = null;
    function showToast(msg, type) {
        clearTimeout(toastTimer);
        toast.textContent = msg;
        toast.className = 'te-toast te-show' + (type ? ' te-' + type : '');
        toastTimer = setTimeout(function () {
            toast.classList.remove('te-show');
        }, 2500);
    }

    // ═══════════════════════════════════════════════════
    //  UTILITIES
    // ═══════════════════════════════════════════════════

    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb.length === 7 ? rgb : '#000000';
        var match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#000000';
        return '#' + [match[1], match[2], match[3]].map(function (x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }).join('');
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function debounce(fn, delay) {
        var timer;
        return function () {
            var ctx = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
        };
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════

    window.TemplateEditor = {
        init: function (opts) {
            if (opts.templateId) CONFIG.templateId = opts.templateId;
            if (opts.clientId) CONFIG.clientId = opts.clientId;
            if (opts.apiEndpoint) {
                CONFIG.apiEndpoint = opts.apiEndpoint;
                CONFIG.useApi = true;
            }

            // Load saved data, then apply and create UI
            loadData(function () {
                applyAllSaved();
                document.body.classList.add('te-ready');
                createUI();
                loadAllEditorFonts();
            });
        },

        // Programmatic access
        getData: function () { return JSON.parse(JSON.stringify(savedData)); },
        setData: function (data) { savedData = data; saveData(); applyAllSaved(); },
        destroy: function () {
            if (isEditing) toggleEditor();
            if (toggleBtn) toggleBtn.remove();
            if (sidebar) sidebar.remove();
            if (overlay) overlay.remove();
            if (statusBar) statusBar.remove();
            if (toast) toast.remove();
        }
    };

})();
