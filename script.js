// --- SIDEBAR TOGGLE ---
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// --- DASHBOARD NAVIGATION LOGIC ---
let currentStep = 1;
const totalSteps = 12;

function showStep(stepIndex) {
    if (stepIndex < 1 || stepIndex > totalSteps) return;
    
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active-step'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById('step_' + stepIndex).classList.add('active-step');
    document.getElementById('nav_' + stepIndex).classList.add('active');
    
    let prevVis = (stepIndex === 1) ? 'hidden' : 'visible';
    let nextVis = (stepIndex === totalSteps) ? 'hidden' : 'visible';

    document.getElementById('btnPrev').style.visibility = prevVis;
    document.getElementById('btnNext').style.visibility = nextVis;
    document.getElementById('btnPrevTop').style.visibility = prevVis;
    document.getElementById('btnNextTop').style.visibility = nextVis;
    
    currentStep = stepIndex;
    document.getElementById('main-content').scrollTop = 0;
}

function changeStep(direction) {
    showStep(currentStep + direction);
}

// Zeigt Fehler beim Absenden an und springt zum falschen Tab
document.addEventListener('invalid', function(e){
    var step = e.target.closest('.step');
    if(step) {
        var stepId = parseInt(step.id.split('_')[1]);
        if(currentStep !== stepId) { showStep(stepId); }
    }
    e.target.classList.add('error-highlight');
    setTimeout(() => e.target.scrollIntoView({behavior: 'smooth', block: 'center'}), 100);
}, true);

// Sidebar Status Update
function toggleSectionState(stepId, checkboxElem) {
    var step = document.getElementById('step_' + stepId);
    
    if (checkboxElem.checked) {
        step.classList.remove('section-disabled');
        step.querySelectorAll('input, select, textarea').forEach(el => { if(el !== checkboxElem) el.disabled = false; });
    } else {
        step.classList.add('section-disabled');
        step.querySelectorAll('input, select, textarea').forEach(el => { 
            if(el !== checkboxElem) {
                el.disabled = true; 
                el.classList.remove('error-highlight');
            }
        });
    }
    buildTopology(); 
    updateStepStatus(stepId);
}

// --- JSON EXPORT / IMPORT ---
function exportJSON() {
    saveForm(); 
    let data = localStorage.getItem('mobileConfigData');
    if(!data || data === '{}') { alert("Keine Daten zum Exportieren vorhanden."); return; }
    
    var customer = document.getElementById('customer').value || 'Unknown';
    var ticket = document.getElementById('ticketNo').value || '000';
    var cleanCustomerStr = customer.replace(/[^a-z0-9]/gi, '_');
    var filename = 'Config_' + cleanCustomerStr + '_Ticket-' + ticket + '.json';

    let blob = new Blob([data], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    event.stopPropagation(); // Verhindert, dass das Formular ein 'change' Event registriert
    clearTimeout(debounceTimer); // Stoppt alle laufenden Speicher-Prozesse

    let file = event.target.files[0];
    if(!file) return;
    
    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            let content = e.target.result;
            if (!content || content.trim() === '') throw new Error("Die Datei ist leer.");
            
            JSON.parse(content); // Prüft, ob es valides JSON ist
            
            localStorage.setItem('mobileConfigData', content);
            alert("Konfiguration erfolgreich importiert! Die Seite wird nun neu geladen.");
            
            event.target.value = ''; // Input zurücksetzen
            window.location.reload();
        } catch(err) {
            console.error("Import Fehler:", err);
            alert("Fehler beim Lesen der Datei: " + err.message + "\nBitte stelle sicher, dass es eine gültige .json Datei ist.");
            event.target.value = ''; 
        }
    };
    reader.readAsText(file);
}

// --- POSITION & RESOLUTION VARIABLES ---
var extPositions = '<option value="">-- Select Position --</option><option value="Front">Front</option><option value="Mid">Mid</option><option value="Rear">Rear</option><option value="Inner">Inner</option><option value="Side Right">Side Right</option><option value="Side Right Rear">Side Right Rear</option><option value="Side Left">Side Left</option><option value="Side Top Left and Right">Side Top Left and Right</option><option value="Side Bottom Left and Right">Side Bottom Left and Right</option><option value="Driver Top and Bottom">Driver Top and Bottom</option><option value="CoDriver Top and Bottom">CoDriver Top and Bottom</option>';
var intPositions = '<option value="">-- Select Position --</option><option value="Inner 1">Inner 1</option><option value="Inner 2">Inner 2</option><option value="Inner 3">Inner 3</option><option value="Inner 4">Inner 4</option><option value="Inner 5">Inner 5</option><option value="Inner 6">Inner 6</option><option value="Inner 7">Inner 7</option><option value="Inner 8">Inner 8</option><option value="Inner 9">Inner 9</option>';
var infoPositions = '<option value="">-- Select Position --</option><option value="Front">Front</option><option value="Front Left">Front Left</option><option value="Front Right">Front Right</option><option value="Front 1">Front 1</option><option value="Front 2">Front 2</option><option value="Mid">Mid</option><option value="Mid Left">Mid Left</option><option value="Mid Right">Mid Right</option><option value="Mid 1">Mid 1</option><option value="Mid 2">Mid 2</option><option value="Rear">Rear</option><option value="Rear Left">Rear Left</option><option value="Rear Right">Rear Right</option><option value="Rear 1">Rear 1</option><option value="Rear 2">Rear 2</option><option value="Other">Other</option><option value="Front/Rear">Front/Rear</option><option value="Front/Mid/Rear">Front/Mid/Rear</option><option value="Internal Mounted">Internal Mounted</option><option value="Internal Mounted 1">Internal Mounted 1</option><option value="Internal Mounted 2">Internal Mounted 2</option><option value="Internal Mounted 3">Internal Mounted 3</option><option value="Internal Mounted 4">Internal Mounted 4</option><option value="Internal Mounted 5">Internal Mounted 5</option><option value="ID.1">ID.1</option><option value="ID.2">ID.2</option><option value="ID.3">ID.3</option><option value="ID.4">ID.4</option><option value="ID.5">ID.5</option><option value="ID.6">ID.6</option><option value="TFT 1">TFT 1</option><option value="TFT 2">TFT 2</option><option value="TFT 3">TFT 3</option><option value="TFT 4">TFT 4</option>';
var infoResolutions = '<option value="">-- Select Resolution --</option><option value="15&quot; (1024 x 768)">15" (1024 x 768)</option><option value="18.5&quot; (1366 x 768)">18.5" (1366 x 768)</option><option value="18.5&quot; (1920 x 1080)">18.5" (1920 x 1080)</option><option value="2x18.5&quot; (1920 x 1080)">2x18.5" (1920 x 1080)</option><option value="21.5&quot; (1920 x 1080)">21.5" (1920 x 1080)</option><option value="24&quot; (1920 x 1080)">24" (1920 x 1080)</option><option value="28&quot; (1920 x 248)">28" (1920 x 248)</option><option value="28&quot; (1920 x 357)">28" (1920 x 357)</option><option value="29&quot; (1920 x 540)">29" (1920 x 540)</option><option value="29&quot; (1920 x 610)">29" (1920 x 610)</option><option value="29&quot; (1920 x 630)">29" (1920 x 630)</option><option value="32&quot; (1920 x 1080)">32" (1920 x 1080)</option><option value="35.8&quot; (1920 x 534)">35.8" (1920 x 534)</option><option value="43&quot; (1080 x 1920)">43" (1080 x 1920)</option><option value="48.4&quot; (1920 x 358)">48.4" (1920 x 358)</option><option value="55&quot; (1080 x 1920)">55" (1080 x 1920)</option><option value="65&quot; (1080 x 1920)">65" (1080 x 1920)</option>';

function getIbisCheckboxes(namePrefix) {
    var telegrams = ['DS001','DS001a','DS001e','DS002','DS003','DS003a','DS003c','DS003d','DS004','DS008','DS009','DS010','DS010b','DS010e','DS010f','DS010j','DS020','DS021','DS021a','DS021c'];
    return telegrams.map(t => `<label><input type="checkbox" name="${namePrefix}_${t}" id="${namePrefix}_${t}" value="${t}"> ${t}</label>`).join('');
}

// INIT DROPDOWNS
for(let i=1; i<=15; i++) {
    document.getElementById('extSignCount').innerHTML += `<option value="${i}">${i}</option>`;
    document.getElementById('intSignCount').innerHTML += `<option value="${i}">${i}</option>`;
    document.getElementById('cctvCamCount').innerHTML += `<option value="${i}">${i}</option>`;
}
for(let i=1; i<=8; i++) {
    document.getElementById('infoCount').innerHTML += `<option value="${i}">${i}</option>`;
}
document.getElementById('cuIbisList').innerHTML = getIbisCheckboxes('cuIbisTelegram');
document.getElementById('infoIbisList').innerHTML = getIbisCheckboxes('infoIbisTelegram');

// HELPER: ZEIGT GESPEICHERTEN DATEINAMEN AN
function showSavedFileName(inputId, filename) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    var labelId = inputId + '_savedName';
    var label = document.getElementById(labelId);
    if (!label) {
        label = document.createElement('div');
        label.id = labelId;
        label.style.fontWeight = 'bold';
        label.style.fontSize = '0.9em';
        label.style.marginTop = '8px';
        inp.parentNode.appendChild(label);
    }
    
    if (inp.files && inp.files.length > 0) {
        label.style.color = '#28a745';
        label.innerText = '✓ Ausgewählt: ' + filename;
    } else {
        label.style.color = '#d9534f';
        label.innerText = '⚠ Letzter Upload (Fehlt nach Reload!): ' + filename;
    }
}

// --- STATUS DOTS LOGIC ---
function updateAllStatuses() {
    for (let i = 1; i <= totalSteps; i++) {
        updateStepStatus(i);
    }
}

function updateStepStatus(stepId) {
    var step = document.getElementById('step_' + stepId);
    var statusDot = document.getElementById('status_' + stepId);
    var checkbox = document.getElementById('active_' + stepId);

    if (!step || !statusDot || !checkbox) return;

    if (!checkbox.checked) {
        statusDot.innerText = '⚪'; 
        return;
    }

    var isValid = true;
    var elements = step.querySelectorAll('input, select, textarea');
    var storedData = JSON.parse(localStorage.getItem('mobileConfigData') || '{}');
    
    for (let i = 0; i < elements.length; i++) {
        let el = elements[i];
        
        if (el.id === 'active_' + stepId) continue;

        var isVisible = true;
        var curr = el;
        while(curr && !curr.classList.contains('step')) {
            if (window.getComputedStyle(curr).display === 'none' || curr.style.display === 'none') {
                isVisible = false; break;
            }
            curr = curr.parentElement;
        }

        if (!el.disabled && isVisible) {
            // FIXED: Nutze .validity.valid anstatt checkValidity(), damit es nicht springt!
            if (el.willValidate && !el.validity.valid) {
                isValid = false;
                break;
            }
            if (el.type === 'file') {
                var key = (el.id || el.name) + '_filename';
                if (storedData[key] && (!el.files || el.files.length === 0)) {
                    isValid = false;
                    break;
                }
            }
        }
    }

    statusDot.innerText = isValid ? '🟢' : '🔴';
}

// --- LOCAL STORAGE / AUTO-SAVE (DEBOUNCED) ---
function saveForm() {
    var existingData = JSON.parse(localStorage.getItem('mobileConfigData') || '{}');
    var formData = {};
    
    document.querySelectorAll('input, select, textarea').forEach(inp => {
        if (!inp.name && !inp.id) return; 
        if (inp.id === 'importJsonFile') return; // Überspringe das Import-Feld
        
        if (inp.type === 'file') {
            var fileKey = (inp.id || inp.name) + '_filename';
            if (inp.files && inp.files.length > 0) {
                var filenames = Array.from(inp.files).map(f => f.name).join(', ');
                formData[fileKey] = filenames;
                showSavedFileName(inp.id, filenames);
            } else if (existingData[fileKey]) {
                formData[fileKey] = existingData[fileKey];
            }
            return;
        }

        if (inp.type === 'checkbox' || inp.type === 'radio') {
            formData[inp.name + '_' + inp.value + '_' + inp.id] = inp.checked;
        } else {
            formData[inp.id || inp.name] = inp.value;
        }
    });
    localStorage.setItem('mobileConfigData', JSON.stringify(formData));
}

function applyDataToForm(data) {
    document.querySelectorAll('input, select, textarea').forEach(inp => {
        if (!inp.name && !inp.id) return;

        if (inp.type === 'file') {
            var key = (inp.id || inp.name) + '_filename';
            if(data[key]) { showSavedFileName(inp.id, data[key]); }
            return;
        }

        if (inp.type === 'checkbox' || inp.type === 'radio') {
            var key = inp.name + '_' + inp.value + '_' + inp.id;
            if(data[key] !== undefined) inp.checked = data[key];
        } else {
            var key = inp.id || inp.name;
            if(data[key] !== undefined) inp.value = data[key];
        }
    });
}

function loadForm() {
    var data = localStorage.getItem('mobileConfigData');
    showStep(1);

    if(!data) { updateAllStatuses(); return; }
    data = JSON.parse(data);

    for (let key in data) {
        if (key.startsWith('top_')) storedTopologyIPs[key] = data[key];
    }

    applyDataToForm(data);
    updateControlUnitSoftware(); 
    handleInfoCategoryChange(); 
    applyDataToForm(data);

    generateExteriorSigns();
    generateInteriorSigns();
    generateInfotainment();
    generateCctvCameras();

    applyDataToForm(data);

    toggleVoltageOther();
    handleCuSoftwareChange();
    checkCuProtocols();
    toggleCuConfigText();
    handleCuNetMode();

    toggleExtOS();
    handleExtNetMode();
    toggleExtConfigText();
    var extCount = parseInt(document.getElementById('extSignCount')?.value) || 0;
    for(let i=1; i<=extCount; i++) {
        toggleExtColor(i);
        let cb = document.getElementById('extCombi_'+i);
        if(cb) toggleCombiSign(i, cb);
    }

    handleIntProtocolChange();
    handleIntNetMode();
    toggleIntConfigText();

    updateInfoDeviceTypes(); 
    handleInfoNetMode();
    handleInfoProtocols();
    toggleInfoConfigText();

    toggleCctvSystemHint();
    handleCctvXsuiteChange();
    handleCctvRecNetMode();
    handleSwitchType();
    handleCamNetMode();

    for(let i=1; i<=12; i++) {
        let cb = document.getElementById('active_' + i);
        if(cb) toggleSectionState(i, cb);
    }

    buildTopology();
    updateAllStatuses();
}

function clearForm() {
    if(confirm('Möchtest du das gesamte Formular löschen und von vorne beginnen?')) {
        localStorage.removeItem('mobileConfigData');
        window.location.reload();
    }
}

// Debouncing Event Listener
let debounceTimer;
document.getElementById('configForm').addEventListener('input', function(e) {
    if(e.target.classList.contains('error-highlight') && e.target.validity.valid) {
        e.target.classList.remove('error-highlight');
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { saveForm(); updateAllStatuses(); }, 500);
});

document.getElementById('configForm').addEventListener('change', function(e) {
    if (e.target.id === 'importJsonFile') return; // Wichtig für Fall 2!
    
    if(e.target.classList.contains('error-highlight') && e.target.validity.valid) {
        e.target.classList.remove('error-highlight');
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { saveForm(); updateAllStatuses(); }, 50);
});

window.addEventListener('DOMContentLoaded', loadForm);


// --- FILE UPLOAD & PDF GENERATOR (html2pdf) ---
async function handleSubmission(event) {
    event.preventDefault();

    var missingFiles = [];
    var storedData = JSON.parse(localStorage.getItem('mobileConfigData') || '{}');
    
    document.querySelectorAll('input[type="file"]').forEach(inp => {
        var step = inp.closest('.step');
        var isVisible = true;
        var curr = inp;
        while(curr && !curr.classList.contains('step')) {
            if (window.getComputedStyle(curr).display === 'none' || curr.style.display === 'none') {
                isVisible = false; break;
            }
            curr = curr.parentElement;
        }

        if (step && !step.classList.contains('section-disabled') && isVisible) {
            var key = (inp.id || inp.name) + '_filename';
            if (storedData[key] && (!inp.files || inp.files.length === 0)) {
                missingFiles.push("- " + storedData[key]);
            }
        }
    });

    if (missingFiles.length > 0) {
        if (!confirm('ACHTUNG: Folgende Dateien fehlen (Browser Reload):\n\n' + missingFiles.join('\n') + '\n\nMöchtest du trotzdem fortfahren?')) {
            return; 
        }
    }
    
    var customer = document.getElementById('customer').value || 'Unknown';
    var ticket = document.getElementById('ticketNo').value || '000';
    var cleanCustomerStr = customer.replace(/[^a-z0-9]/gi, '_');
    var folderName = 'Config_' + cleanCustomerStr + '_Ticket-' + ticket;

    var filesToProcess = [];
    document.querySelectorAll('input[type="file"]').forEach(inp => {
        if (inp.offsetParent !== null && inp.files && inp.files.length > 0) {
            Array.from(inp.files).forEach(file => filesToProcess.push(file));
        }
    });

    var isElectron = (typeof process !== 'undefined' && process.versions && process.versions.electron);

    if (filesToProcess.length > 0) {
        if (isElectron) {
            try {
                const fs = require('fs');
                const path = require('path');
                const os = require('os');
                
                let desktopPath = path.join(os.homedir(), 'OneDrive', 'Desktop');
                if (!fs.existsSync(desktopPath)) desktopPath = path.join(os.homedir(), 'Desktop');
                
                const targetFolder = path.join(desktopPath, folderName);
                if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });
                
                for (let file of filesToProcess) {
                    const destPath = path.join(targetFolder, file.name);
                    const arrayBuffer = await file.arrayBuffer();
                    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
                }
                
                alert('Erfolg! Ein Ordner mit den Anhängen wurde auf dem Desktop erstellt:\n' + targetFolder);
                executePDFGeneration(customer, ticket, folderName);
            } catch(e) {
                console.error('File Copy Error:', e);
                fallbackToZip(filesToProcess, folderName, customer, ticket);
            }
        } else {
            fallbackToZip(filesToProcess, folderName, customer, ticket);
        }
    } else {
        executePDFGeneration(customer, ticket, folderName);
    }
}

function fallbackToZip(filesToProcess, folderName, customer, ticket) {
    if (typeof JSZip !== 'undefined') {
        var zip = new JSZip();
        filesToProcess.forEach(file => zip.file(file.name, file));
        
        zip.generateAsync({type:"blob"}).then(function(content) {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = folderName + "_Attachments.zip";
            a.click();
            
            setTimeout(() => executePDFGeneration(customer, ticket, folderName), 500);
        });
    } else {
        executePDFGeneration(customer, ticket, folderName);
    }
}

function executePDFGeneration(customer, ticket, folderName) {
    var summaryHtml = '<div style="font-family: \'Segoe UI\', sans-serif; color: #333; width: 800px; padding: 20px; background: white;">';
    summaryHtml += '<h1 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Mobile Configuration Report</h1>';
    summaryHtml += '<p style="text-align: center; color: #666; font-size: 1.1em; margin-bottom: 30px;">PTO: <strong style="color:#000;">' + customer + '</strong> | Order/Ticket No: <strong style="color:#000;">' + ticket + '</strong></p>';

    document.querySelectorAll('.step:not(.section-disabled)').forEach(function(fs) {
        var titleEl = fs.querySelector('.step-title');
        if(!titleEl) return;
        var title = titleEl.innerText.trim();
        
        var fsHtml = '<div style="margin-bottom: 25px; page-break-inside: avoid;">';
        fsHtml += '<h2 style="background-color: #f4f7f6; padding: 10px; color: #0056b3; border-left: 5px solid #0056b3; margin-bottom: 10px; font-size: 1.2em;">' + title + '</h2>';
        fsHtml += '<table style="width: 100%; border-collapse: collapse; font-size: 0.95em;">';
        
        var hasData = false;
        var currentBox = null;

        fs.querySelectorAll('.form-group').forEach(function(group) {
            if(group.classList.contains('no-pdf-print')) return;

            var isVisible = true;
            var curr = group;
            
            while(curr && !curr.classList.contains('step')) {
                if (window.getComputedStyle(curr).display === 'none' || curr.style.display === 'none') {
                    isVisible = false; break;
                }
                curr = curr.parentElement;
            }
            
            if(!isVisible) return;

            var labelEl = group.querySelector('label');
            if(!labelEl) return;
            
            var labelText = getCleanLabelText(labelEl);
            if (labelText.includes('Is this a Combi Sign') || labelText.includes('Section Active')) return; 

            var values = [];
            group.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="password"], input[type="file"], textarea').forEach(function(inp) {
                if (inp.type === 'file') {
                    if (inp.files && inp.files.length > 0) {
                        values.push(Array.from(inp.files).map(f => f.name).join(', '));
                    } else {
                        var storedData = JSON.parse(localStorage.getItem('mobileConfigData') || '{}');
                        var key = (inp.id || inp.name) + '_filename';
                        if (storedData[key]) {
                            values.push(storedData[key] + ' (Nicht mitgesendet)');
                        }
                    }
                } else if (inp.value.trim() !== '') {
                    values.push(inp.value.trim());
                }
            });

            group.querySelectorAll('select').forEach(function(sel) {
                if(sel.value !== '' && sel.value !== '0') values.push(sel.options[sel.selectedIndex].text);
            });

            group.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').forEach(function(chk) {
                if(!chk.classList.contains('step-toggle') && chk.name && !chk.name.startsWith('active_')) {
                    values.push(chk.parentNode.innerText.trim());
                }
            });
            
            if (labelText.includes('Configuration Exists') && values.length === 1 && values[0] === 'No') return;

            if(values.length > 0) {
                var box = group.closest('.dynamic-box');
                if (box !== currentBox) {
                    if (box !== null) {
                        var h4 = box.querySelector('h4').innerText;
                        fsHtml += '<tr style="background-color: #e9ecef;"><td colspan="2" style="padding: 8px; font-weight: bold; color: #0056b3; border-bottom: 1px solid #ccc; border-top: 2px solid #0056b3;">' + h4 + '</td></tr>';
                    }
                    currentBox = box;
                }
                var paddingLeft = box ? '20px' : '8px';
                fsHtml += '<tr style="border-bottom: 1px solid #eee;">';
                fsHtml += '<td style="padding: 8px; width: 40%; vertical-align: top; font-weight: bold; color: #444; padding-left: ' + paddingLeft + ';">' + labelText + '</td>';
                fsHtml += '<td style="padding: 8px; width: 60%; vertical-align: top;">' + values.join(', ') + '</td>';
                fsHtml += '</tr>';
                hasData = true;
            }
        });
        fsHtml += '</table></div>';
        if(hasData) summaryHtml += fsHtml;
    });

    summaryHtml += '</div>';

    var printDiv = document.createElement('div');
    printDiv.innerHTML = summaryHtml;
    var printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.appendChild(printDiv);
    document.body.appendChild(printContainer);

    var opt = {
        margin:       15,
        filename:     folderName + '.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(printDiv).save().then(() => {
        document.body.removeChild(printContainer);
    });
}

function getCleanLabelText(labelEl) {
    var clone = labelEl.cloneNode(true);
    clone.querySelectorAll('.dhcp-toggle, .checkbox-group, input, select, span').forEach(el => el.remove());
    return clone.innerText.replace('*', '').replace(':', '').trim();
}

// --- TOPOLOGY LOGIC ---
var storedTopologyIPs = {};

function handleTopIPChange(el) { storedTopologyIPs[el.id] = el.value; }
function syncTopologyValue(originalId) {
    var topInput = document.getElementById('top_' + originalId);
    if(topInput && document.getElementById(originalId)) topInput.value = document.getElementById(originalId).value;
}

function buildTopology() {
    var container = document.getElementById('topologyIPsContainer');
    container.querySelectorAll('input[type="text"]').forEach(inp => storedTopologyIPs[inp.id] = inp.value);
    container.innerHTML = '';
    var hasAny = false;

    function addTopoItem(id, label, isDhcp, val, isUpperRequired) {
        hasAny = true;
        var reqAttr = isDhcp ? 'required' : (isUpperRequired ? 'required' : '');
        var html = '<div class="form-row form-group" style="margin-bottom:10px; align-items: center;">';
        html += '<div style="flex: 1; padding-right:15px;"><label style="font-weight:600;" for="top_' + id + '">' + label + (isDhcp ? ' IP <span style="color:#d9534f; font-size: 0.9em; font-weight:normal;">(DHCP - Enter Reserved IP)</span>' : ' IP') + '</label></div>';
        html += '<div style="flex: 2;"><input type="text" id="top_' + id + '" name="top_' + id + '" value="' + val + '" ' + (isDhcp ? '' : 'readonly') + ' ' + reqAttr + ' style="' + (isDhcp ? '' : 'background-color:#e9ecef;') + '" pattern="^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$" title="Please enter a valid IP address" oninput="handleTopIPChange(this)"></div></div>';
        container.insertAdjacentHTML('beforeend', html);
    }

    if (!document.getElementById('step_4').classList.contains('section-disabled')) {
        if (document.getElementById('cuNetModeGroup').style.display !== 'none') {
            let mode = document.querySelector('input[name="cuNetMode"]:checked')?.value;
            if (mode) {
                let isDhcp = (mode === 'DHCP');
                let val = isDhcp ? (storedTopologyIPs['top_cuIP'] || '') : (document.getElementById('cuIP')?.value || '');
                let isReq = document.getElementById('cuIP')?.hasAttribute('required');
                addTopoItem('cuIP', 'Control Unit', isDhcp, val, isReq);
            }
        }
    }

    function processDynamic(fsId, countId, netModeName, ipIdPrefix, labelPrefix, protocolName) {
        if (document.getElementById('step_' + fsId).classList.contains('section-disabled')) return;
        
        if (protocolName) {
            let prot = document.querySelector(`input[name="${protocolName}"]:checked`)?.value;
            if (prot !== 'Ethernet') return;
        }
        
        let mode = document.querySelector(`input[name="${netModeName}"]:checked`)?.value || 'Fixed';
        let count = parseInt(document.getElementById(countId).value) || 0;
        let isDhcp = (mode === 'DHCP');
        
        for (let i = 1; i <= count; i++) {
            let ipId = ipIdPrefix + '_' + i;
            let inp = document.getElementById(ipId);
            if (inp) {
                let val = isDhcp ? (storedTopologyIPs['top_' + ipId] || '') : inp.value;
                addTopoItem(ipId, labelPrefix + ' ' + i, isDhcp, val, inp.hasAttribute('required'));
            }
        }
    }

    processDynamic('5', 'extSignCount', 'extNetMode', 'extIP', 'Exterior Sign', 'extProtocol');
    processDynamic('6', 'intSignCount', 'intNetMode', 'intIP', 'Interior Sign', 'intProtocol');
    processDynamic('7', 'infoCount', 'infoNetMode', 'infoIP', 'Infotainment Device', null);

    if (!document.getElementById('step_8').classList.contains('section-disabled')) {
        if (document.querySelector('input[name="cctvXsuite"]:checked')?.value !== 'Yes') {
            let mode = document.querySelector('input[name="cctvRecNetMode"]:checked')?.value;
            if (mode) {
                let isDhcp = (mode === 'DHCP');
                let inp = document.getElementById('cctvRecIP');
                let val = isDhcp ? (storedTopologyIPs['top_cctvRecIP'] || '') : (inp?.value || '');
                addTopoItem('cctvRecIP', 'CCTV Recorder', isDhcp, val, inp?.hasAttribute('required'));
            }
        }
        let camMode = document.querySelector('input[name="camNetMode"]:checked')?.value;
        if (camMode) {
            let count = parseInt(document.getElementById('cctvCamCount').value) || 0;
            let isDhcp = (camMode === 'DHCP');
            for (let i = 1; i <= count; i++) {
                let ipId = 'cctvCamIP_' + i;
                let inp = document.getElementById(ipId);
                if (inp) {
                    let val = isDhcp ? (storedTopologyIPs['top_' + ipId] || '') : inp.value;
                    addTopoItem(ipId, 'Camera ' + i, isDhcp, val, inp.hasAttribute('required'));
                }
            }
        }
    }

    if(!hasAny) container.innerHTML = '<p style="color:#666; font-size:0.9em; margin: 0;">No active IP devices found. Configure devices with Fixed IP or DHCP to see them listed here.</p>';
}

// --- FORM LOGIC ---
function toggleVoltageOther() {
    var r = document.querySelector('input[name="vehicleVoltage"]:checked')?.value;
    var grp = document.getElementById('voltageOtherGroup');
    var inp = document.getElementById('voltageOtherText');
    grp.style.display = (r === 'Other') ? 'block' : 'none';
    if(r === 'Other') inp.setAttribute('required', 'required');
    else { inp.removeAttribute('required'); inp.value = ''; }
}

function handleCuNetMode() {
    var mode = document.querySelector('input[name="cuNetMode"]:checked')?.value;
    var cuIpGroup = document.getElementById('cuIpGroup');
    var cuIpInput = document.getElementById('cuIP');
    if (mode === 'Fixed') { cuIpGroup.style.display = 'block'; cuIpInput.setAttribute('required', 'required'); } 
    else { cuIpGroup.style.display = 'none'; cuIpInput.removeAttribute('required'); }
    buildTopology();
}

function updateControlUnitSoftware() {
    var val = document.querySelector('input[name="controlUnit"]:checked')?.value;
    document.getElementById('cuSoftwareGroup').style.display = 'none';
    document.getElementById('cuOtherGroup').style.display = 'none';
    document.getElementById('extVdv301XmlGroup').style.display = 'none'; 
    document.getElementById('cuProtocolsGroup').style.display = 'none';
    document.getElementById('cuConfigExistsGroup').style.display = 'none';
    document.getElementById('cuOtherText').removeAttribute('required');
    
    if(val) {
        if(val !== 'None') {
            document.getElementById('cuProtocolsGroup').style.display = 'block';
            document.getElementById('cuConfigExistsGroup').style.display = 'block';
            checkCuProtocols();
        }
        if(val === 'ICU602' || val === 'ICU602i') {
            document.getElementById('cuSoftwareOptions').innerHTML = '<label><input type="radio" id="cuSwMIE" name="cuSoftware" value="MIE" onchange="handleCuSoftwareChange()" required> MIE</label><label><input type="radio" id="cuSwLUS" name="cuSoftware" value="LUS" onchange="handleCuSoftwareChange()" required> LUS</label>';
            document.getElementById('cuSoftwareGroup').style.display = 'block';
        } else if(val === 'CU.Basic/L5813A') {
            document.getElementById('cuSoftwareOptions').innerHTML = '<label><input type="radio" id="cuSwIC" name="cuSoftware" value="iCenter" onchange="handleCuSoftwareChange()" required> iCenter</label><label><input type="radio" id="cuSwLawo" name="cuSoftware" value="Lawo" onchange="handleCuSoftwareChange()" required> Lawo</label>';
            document.getElementById('cuSoftwareGroup').style.display = 'block';
        } else if(val === 'Other') {
            document.getElementById('cuOtherGroup').style.display = 'block';
            document.getElementById('cuOtherText').setAttribute('required', 'required');
        } else if(val === 'None') {
            document.getElementById('extVdv301XmlGroup').style.display = 'block';
        }
    }
    handleCuSoftwareChange();
}

function checkCuProtocols() {
    var getChecked = (val) => document.querySelector(`input[name="cuProtocol"][value="${val}"]`)?.checked;
    
    var vdv300 = document.getElementById('cuVdv300TelegramsGroup');
    vdv300.style.display = getChecked("VDV 300") ? 'block' : 'none';
    if(vdv300.style.display === 'none') vdv300.querySelectorAll('input').forEach(i=>i.checked=false);

    var vdv301 = document.getElementById('cuVdv301XmlGroup');
    vdv301.style.display = getChecked("VDV 301") ? 'block' : 'none';
    if(vdv301.style.display === 'none') vdv301.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});

    var itxpt = document.getElementById('cuItxptGroup');
    itxpt.style.display = getChecked("ITxPT") ? 'block' : 'none';
    if(itxpt.style.display === 'none') itxpt.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});

    var sntp = document.getElementById('cuSntpTextGroup');
    sntp.style.display = getChecked("SNTP") ? 'block' : 'none';
    if(sntp.style.display === 'none') sntp.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('cuSntpDetails').setAttribute('required', 'required');

    var mqttUrl = document.getElementById('cuMqttUrlGroup');
    mqttUrl.style.display = getChecked("MQTT-URL") ? 'block' : 'none';
    if(mqttUrl.style.display === 'none') mqttUrl.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('cuMqttUrlDetails').setAttribute('required', 'required');

    var mqttPis = document.getElementById('cuMqttPisGroup');
    mqttPis.style.display = getChecked("MQTT-PIS") ? 'block' : 'none';
    if(mqttPis.style.display === 'none') mqttPis.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('cuMqttPisDetails').setAttribute('required', 'required');

    var htmlDisp = document.getElementById('cuHtmlDisplayGroup');
    htmlDisp.style.display = getChecked("HTML Display Services") ? 'block' : 'none';
    if(htmlDisp.style.display === 'none') htmlDisp.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('cuHtmlDisplayDetails').setAttribute('required', 'required');
}

function toggleCuConfigText() {
    var r = document.querySelector('input[name="cuConfigExists"]:checked')?.value;
    var grp = document.getElementById('cuConfigTextGroup');
    grp.style.display = (r === 'Yes') ? 'block' : 'none';
    var inp = document.getElementById('cuConfigName');
    if(r === 'Yes') inp.setAttribute('required', 'required');
    else { inp.removeAttribute('required'); inp.value = ''; }
}

function handleCuSoftwareChange() {
    var cu = document.querySelector('input[name="controlUnit"]:checked')?.value;
    var sw = document.querySelector('input[name="cuSoftware"]:checked')?.value;
    
    var showCuIp = (cu === 'ICU602' || cu === 'ICU602i') || (cu === 'CU.Basic/L5813A' && sw === 'iCenter');
    var nmGroup = document.getElementById('cuNetModeGroup');
    var nmRadios = document.querySelectorAll('input[name="cuNetMode"]');
    
    if (showCuIp) {
        nmGroup.style.display = 'block';
        nmRadios.forEach(r => r.setAttribute('required', 'required'));
        handleCuNetMode();
    } else {
        nmGroup.style.display = 'none';
        nmRadios.forEach(r => { r.removeAttribute('required'); r.checked = false; });
        document.getElementById('cuIpGroup').style.display = 'none';
        document.getElementById('cuIP').removeAttribute('required');
    }
    
    var isLawo = (sw === 'Lawo');
    var extEthLabel = document.getElementById('extEthOptionLabel');
    var intEthLabel = document.getElementById('intEthOptionLabel');
    if (extEthLabel) extEthLabel.style.display = isLawo ? 'none' : 'inline-flex';
    if (intEthLabel) intEthLabel.style.display = isLawo ? 'none' : 'inline-flex';
    if(isLawo) {
        var e = document.querySelector('input[name="extProtocol"][value="Ethernet"]');
        var i = document.querySelector('input[name="intProtocol"][value="Ethernet"]');
        if(e && e.checked) { e.checked = false; toggleExtOS(); }
        if(i && i.checked) { i.checked = false; handleIntProtocolChange(); }
    }
    
    document.querySelectorAll('[id^="extAddressLabel_"]').forEach(lbl => {
        var idx = lbl.id.split('_')[1];
        var isCombi = document.getElementById('extCombi_' + idx)?.checked;
        lbl.innerText = isCombi ? (isLawo ? 'IBIS Address 1' : 'FF Address 1') : (isLawo ? 'IBIS Address' : 'FF Address');
    });
    document.querySelectorAll('[id^="extAddress2Label_"]').forEach(lbl => {
        lbl.innerText = isLawo ? 'IBIS Address 2' : 'FF Address 2';
    });

    var ibisInt = document.querySelector('input[name="intProtocol"][value="IBIS"]')?.checked;
    document.querySelectorAll('[id^="intAddressLabel_"]').forEach(lbl => {
        lbl.innerText = (isLawo || ibisInt) ? 'IBIS Address' : 'FF Address';
    });

    buildTopology();
}

function handleExtNetMode() {
    var mode = document.querySelector('input[name="extNetMode"]:checked')?.value;
    var isFixed = (mode === 'Fixed');
    var isMandatory = document.querySelector('.sec5-req-label').classList.contains('required');
    
    document.querySelectorAll('.ext-ip-address-group').forEach(function(g) {
        g.style.display = isFixed ? 'block' : 'none';
        var inp = g.querySelector('input[type="text"]');
        if(isFixed && isMandatory) inp.setAttribute('required', 'required');
        else { inp.removeAttribute('required'); }
    });
    buildTopology();
}

function toggleExtOS() {
    var eth = document.querySelector('input[name="extProtocol"][value="Ethernet"]')?.checked;
    var isMandatory = document.querySelector('.sec5-req-label').classList.contains('required');
    
    var osGrp = document.getElementById('extOSGroup');
    var osSel = document.getElementById('extOS');
    osGrp.style.display = eth ? 'block' : 'none';
    if(eth && isMandatory) osSel.setAttribute('required', 'required');
    else { osSel.removeAttribute('required'); osSel.value = ''; }

    var nmGrp = document.getElementById('extNetModeGroup');
    var nmRadios = document.querySelectorAll('input[name="extNetMode"]');
    nmGrp.style.display = eth ? 'block' : 'none';
    if(eth && isMandatory) nmRadios.forEach(r => r.setAttribute('required', 'required'));
    else nmRadios.forEach(r => { r.removeAttribute('required'); r.checked = false; });
    
    handleExtNetMode();
}

function toggleExtConfigText() {
    var r = document.querySelector('input[name="extConfigExists"]:checked')?.value;
    var grp = document.getElementById('extConfigTextGroup');
    grp.style.display = (r === 'Yes') ? 'block' : 'none';
    var inp = document.getElementById('extConfigName');
    if(r === 'Yes') inp.setAttribute('required', 'required');
    else { inp.removeAttribute('required'); inp.value=''; }
}

function toggleExtColor(index) {
    var mono = document.querySelector(`input[name="extColorType_${index}"][value="Monochrom"]`)?.checked;
    var group = document.getElementById(`extMonoColorGroup_${index}`);
    var isMandatory = document.querySelector('.sec5-req-label').classList.contains('required');
    group.style.display = mono ? 'block' : 'none';
    group.querySelectorAll('input[type="radio"]').forEach(inp => {
        if(mono && isMandatory) inp.setAttribute('required', 'required');
        else { inp.removeAttribute('required'); inp.checked=false; }
    });
}

function toggleCombiSign(index, cb) {
    var group2 = document.getElementById(`extAddress2Group_${index}`);
    var isMandatory = document.querySelector('.sec5-req-label').classList.contains('required');
    var isLawo = document.querySelector('input[name="cuSoftware"]:checked')?.value === 'Lawo';
    
    group2.style.display = cb.checked ? 'block' : 'none';
    document.getElementById(`extAddressLabel_${index}`).innerText = cb.checked ? (isLawo ? 'IBIS Address 1' : 'FF Address 1') : (isLawo ? 'IBIS Address' : 'FF Address');
    var inp2 = document.getElementById(`extAdd2_${index}`);
    if(cb.checked && isMandatory) inp2.setAttribute('required', 'required');
    else { inp2.removeAttribute('required'); inp2.value=''; }
}

function generateExteriorSigns() {
    var count = parseInt(document.getElementById('extSignCount').value) || 0;
    var cont = document.getElementById('dynamicSignsContainer');
    var eth = document.querySelector('input[name="extProtocol"][value="Ethernet"]')?.checked;
    var mode = document.querySelector('input[name="extNetMode"]:checked')?.value;
    var isMandatory = document.querySelector('.sec5-req-label').classList.contains('required');
    var isLawo = document.querySelector('input[name="cuSoftware"]:checked')?.value === 'Lawo';
    
    var showIp = (eth && mode === 'Fixed');
    var reqAttr = isMandatory ? 'required' : '';
    var addr1Label = isLawo ? 'IBIS Address' : 'FF Address';
    var addr2Label = isLawo ? 'IBIS Address 2' : 'FF Address 2';

    cont.innerHTML = '';
    if (isNaN(count) || count === 0) { buildTopology(); return; }

    for (var i = 1; i <= count; i++) {
        let html = `<div class="dynamic-box"><h4>Exterior Sign ${i}</h4>
            <div class="form-row">
                <div class="form-group"><label for="extItemNumber_${i}">Item Number</label><input type="text" id="extItemNumber_${i}" name="extItemNumber_${i}"></div>
                <div class="form-group"><label class="${isMandatory?'required':''}" for="extResolution_${i}">Resolution</label><input type="text" id="extResolution_${i}" name="extResolution_${i}" ${reqAttr}></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label class="${isMandatory?'required':''}">Color Type</label><div class="checkbox-group"><label><input type="radio" id="extCT_M_${i}" name="extColorType_${i}" value="Monochrom" onchange="toggleExtColor(${i})" ${reqAttr}> Monochrom</label><label><input type="radio" id="extCT_R_${i}" name="extColorType_${i}" value="RGB" onchange="toggleExtColor(${i})" ${reqAttr}> RGB</label></div></div>
                <div class="form-group conditional-group" id="extMonoColorGroup_${i}" style="display:none; margin-top:0;"><label class="${isMandatory?'required':''}">Monochrom Color</label><div class="checkbox-group"><label><input type="radio" id="extMC_W_${i}" name="extMonoColor_${i}" value="White"> White</label><label><input type="radio" id="extMC_A_${i}" name="extMonoColor_${i}" value="Amber"> Amber</label></div></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Is this a Combi Sign?</label><div class="checkbox-group"><label><input type="checkbox" id="extCombi_${i}" name="extCombi_${i}" onchange="toggleCombiSign(${i}, this)"> Yes, show 2nd address</label></div></div>
                <div class="form-group"><label class="${isMandatory?'required':''}" for="extPosition_${i}">Position</label><select id="extPosition_${i}" name="extPosition_${i}" ${reqAttr}>${extPositions}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label class="${isMandatory?'required':''}" id="extAddressLabel_${i}" for="extAdd_${i}">${addr1Label}</label><input type="text" id="extAdd_${i}" name="extAdd_${i}" ${reqAttr}></div>
                <div class="form-group" id="extAddress2Group_${i}" style="display:none;"><label class="${isMandatory?'required':''}" id="extAddress2Label_${i}" for="extAdd2_${i}">${addr2Label}</label><input type="text" id="extAdd2_${i}" name="extAdd2_${i}"></div>
            </div>
            <div class="form-group ext-ip-address-group" style="display:${showIp ? 'block' : 'none'};"><label class="required" for="extIP_${i}">IP Address</label><input type="text" id="extIP_${i}" name="extIP_${i}" placeholder="e.g. 192.168.1.100" pattern="^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$" oninput="syncTopologyValue(this.id)" ${showIp&&isMandatory ? 'required' : ''}></div>
        </div>`;
        cont.insertAdjacentHTML('beforeend', html);
    }
    buildTopology();
}

function handleIntNetMode() {
    var mode = document.querySelector('input[name="intNetMode"]:checked')?.value;
    var isFixed = (mode === 'Fixed');
    var isMandatory = document.querySelector('.sec6-req-label').classList.contains('required');
    
    document.querySelectorAll('.int-ip-address-group').forEach(function(g) {
        g.style.display = isFixed ? 'block' : 'none';
        var inp = g.querySelector('input[type="text"]');
        if(isFixed && isMandatory) inp.setAttribute('required', 'required');
        else { inp.removeAttribute('required'); }
    });
    buildTopology();
}

function handleIntProtocolChange() {
    var eth = document.querySelector('input[name="intProtocol"][value="Ethernet"]')?.checked;
    var ibis = document.querySelector('input[name="intProtocol"][value="IBIS"]')?.checked;
    var isMandatory = document.querySelector('.sec6-req-label').classList.contains('required');
    var isLawo = document.querySelector('input[name="cuSoftware"]:checked')?.value === 'Lawo';

    var osGrp = document.getElementById('intOSGroup');
    var osSel = document.getElementById('intOS');
    osGrp.style.display = eth ? 'block' : 'none';
    if(eth && isMandatory) osSel.setAttribute('required', 'required');
    else { osSel.removeAttribute('required'); osSel.value = ''; }

    var nmGrp = document.getElementById('intNetModeGroup');
    var nmRadios = document.querySelectorAll('input[name="intNetMode"]');
    nmGrp.style.display = eth ? 'block' : 'none';
    if(eth && isMandatory) nmRadios.forEach(r => r.setAttribute('required', 'required'));
    else nmRadios.forEach(r => { r.removeAttribute('required'); r.checked = false; });

    var ibisGrp = document.getElementById('intIbisTelegramsGroup');
    ibisGrp.style.display = ibis ? 'block' : 'none';
    if(!ibis) ibisGrp.querySelectorAll('input').forEach(r => r.checked=false);

    document.querySelectorAll('[id^="intAddressLabel_"]').forEach(lbl => lbl.innerText = (ibis || isLawo) ? 'IBIS Address' : 'FF Address');
    handleIntNetMode();
}

function toggleIntConfigText() {
    var r = document.querySelector('input[name="intConfigExists"]:checked')?.value;
    var grp = document.getElementById('intConfigTextGroup');
    grp.style.display = (r === 'Yes') ? 'block' : 'none';
    var inp = document.getElementById('intConfigName');
    if(r === 'Yes') inp.setAttribute('required', 'required');
    else { inp.removeAttribute('required'); inp.value=''; }
}

function generateInteriorSigns() {
    var count = parseInt(document.getElementById('intSignCount').value) || 0;
    var cont = document.getElementById('dynamicIntSignsContainer');
    var eth = document.querySelector('input[name="intProtocol"][value="Ethernet"]')?.checked;
    var ibis = document.querySelector('input[name="intProtocol"][value="IBIS"]')?.checked;
    var mode = document.querySelector('input[name="intNetMode"]:checked')?.value;
    var isMandatory = document.querySelector('.sec6-req-label').classList.contains('required');
    var isLawo = document.querySelector('input[name="cuSoftware"]:checked')?.value === 'Lawo';
    
    var showIp = (eth && mode === 'Fixed');
    var reqAttr = isMandatory ? 'required' : '';
    var reqClass = isMandatory ? 'class="required"' : '';
    var addressLabelText = (ibis || isLawo) ? 'IBIS Address' : 'FF Address';

    cont.innerHTML = '';
    if (isNaN(count) || count === 0) { buildTopology(); return; }

    for (let i = 1; i <= count; i++) {
        let html = `<div class="dynamic-box"><h4>Interior Sign ${i}</h4>
            <div class="form-row">
                <div class="form-group"><label for="intItemNumber_${i}">Item Number</label><input type="text" id="intItemNumber_${i}" name="intItemNumber_${i}"></div>
                <div class="form-group"><label class="${reqClass}" for="intResolution_${i}">Resolution</label><input type="text" id="intResolution_${i}" name="intResolution_${i}" ${reqAttr}></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label for="intColor_${i}">Color</label><select id="intColor_${i}" name="intColor_${i}"><option value="">-- Select --</option><option value="White">White</option><option value="Amber">Amber</option><option value="Red">Red</option></select></div>
                <div class="form-group"><label class="${reqClass}" for="intPosition_${i}">Position</label><select id="intPosition_${i}" name="intPosition_${i}" ${reqAttr}>${intPositions}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label class="${reqClass}" id="intAddressLabel_${i}" for="intAdd_${i}">${addressLabelText}</label><input type="text" id="intAdd_${i}" name="intAdd_${i}" ${reqAttr}></div>
                <div class="form-group int-ip-address-group" style="display:${showIp ? 'block' : 'none'};"><label class="required" for="intIP_${i}">IP Address</label><input type="text" id="intIP_${i}" name="intIP_${i}" placeholder="e.g. 192.168.1.100" pattern="^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$" oninput="syncTopologyValue(this.id)" ${showIp&&isMandatory ? 'required' : ''}></div>
            </div>
        </div>`;
        cont.insertAdjacentHTML('beforeend', html);
    }
    buildTopology();
}

function handleInfoNetMode() {
    var mode = document.querySelector('input[name="infoNetMode"]:checked')?.value;
    var isFixed = (mode === 'Fixed');
    var isMandatory = document.querySelector('.sec7-req-label').classList.contains('required');
    
    document.querySelectorAll('.info-ip-address-group').forEach(function(g) {
        g.style.display = isFixed ? 'block' : 'none';
        var inp = g.querySelector('input[type="text"]');
        if(isFixed && isMandatory) inp.setAttribute('required', 'required');
        else inp.removeAttribute('required');
    });
    buildTopology();
}

function handleInfoCategoryChange() {
    var cat = document.querySelector('input[name="infoDeviceCategory"]:checked')?.value;
    var procGrp = document.getElementById('infoProcessorGroup');
    var prosysGrp = document.getElementById('infoProsysGroup');
    var procSel = document.getElementById('infoProcessor');
    var prosysSel = document.getElementById('infoProsysVersion');
    var isMandatory = document.querySelector('.sec7-req-label').classList.contains('required');

    if (cat === 'TFT') {
        procGrp.style.display = 'block';
        prosysGrp.style.display = 'none';
        if(isMandatory) procSel.setAttribute('required', 'required');
        prosysSel.removeAttribute('required'); prosysSel.value = '';
    } else if (cat === 'Prosys') {
        procGrp.style.display = 'none';
        prosysGrp.style.display = 'block';
        if(isMandatory) prosysSel.setAttribute('required', 'required');
        procSel.removeAttribute('required'); procSel.value = '';
    } else {
        procGrp.style.display = 'none';
        prosysGrp.style.display = 'none';
        procSel.removeAttribute('required'); procSel.value = '';
        prosysSel.removeAttribute('required'); prosysSel.value = '';
    }
    updateInfoOSOptions();
}

function updateInfoOSOptions() {
    var cat = document.querySelector('input[name="infoDeviceCategory"]:checked')?.value;
    var proc = document.getElementById('infoProcessor').value;
    var osContainer = document.getElementById('infoOSContainer');
    var protContainer = document.getElementById('infoProtocolsContainer');
    var osSelect = document.getElementById('infoOS');
    var currentVal = osSelect.value; 
    var isMandatory = document.querySelector('.sec7-req-label').classList.contains('required');
    
    if (cat === 'TFT' && proc === 'Slave') {
        osContainer.style.display = 'none';
        protContainer.style.display = 'none';
        osSelect.removeAttribute('required');
        osSelect.value = '';
        document.querySelectorAll('input[name="infoProtocol"]').forEach(cb => cb.checked = false);
        handleInfoProtocols();
    } else {
        osContainer.style.display = 'block';
        protContainer.style.display = 'block';
        if(isMandatory) osSelect.setAttribute('required', 'required');

        osSelect.innerHTML = '<option value="">-- Select OS --</option>';
        var opts = [];
        if (cat === 'Prosys') opts = ['Imotion', 'LUS', 'Legacy', 'infoexe'];
        else if (cat === 'TFT') {
            if (proc === 'Q7imx6') opts = ['Imotion', 'LUS', 'Legacy', 'infoexe'];
            else if (proc === 'Q7x86') opts = ['Imotion', 'LUS'];
            else if (proc === 'SMARC/x86' || proc === 'SMARC/imx8m') opts = ['LUS'];
        }
        opts.forEach(o => osSelect.innerHTML += `<option value="${o}" ${o===currentVal?'selected':''}>${o}</option>`);
        if (opts.indexOf(currentVal) === -1) osSelect.value = '';
    }
    updateInfoDeviceTypes();
}

function handleInfoProtocols() {
    var getChecked = (val) => document.querySelector(`input[name="infoProtocol"][value="${val}"]`)?.checked;
    
    var vdv300 = document.getElementById('infoVdv300TelegramsGroup');
    vdv300.style.display = getChecked("VDV 300") ? 'block' : 'none';
    if(vdv300.style.display === 'none') vdv300.querySelectorAll('input').forEach(i=>i.checked=false);

    var vdv301 = document.getElementById('infoVdv301XmlGroup');
    vdv301.style.display = getChecked("VDV 301") ? 'block' : 'none';
    if(vdv301.style.display === 'none') vdv301.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});

    var itxpt = document.getElementById('infoItxptGroup');
    itxpt.style.display = getChecked("ITxPT") ? 'block' : 'none';
    if(itxpt.style.display === 'none') itxpt.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});

    var sntp = document.getElementById('infoSntpTextGroup');
    sntp.style.display = getChecked("SNTP") ? 'block' : 'none';
    if(sntp.style.display === 'none') sntp.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('infoSntpDetails').setAttribute('required', 'required');

    var mqttUrl = document.getElementById('infoMqttUrlGroup');
    mqttUrl.style.display = getChecked("MQTT-URL") ? 'block' : 'none';
    if(mqttUrl.style.display === 'none') mqttUrl.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('cuMqttUrlDetails').setAttribute('required', 'required');

    var mqttPis = document.getElementById('infoMqttPisGroup');
    mqttPis.style.display = getChecked("MQTT-PIS") ? 'block' : 'none';
    if(mqttPis.style.display === 'none') mqttPis.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('infoMqttPisDetails').setAttribute('required', 'required');

    var htmlDisp = document.getElementById('infoHtmlDisplayGroup');
    htmlDisp.style.display = getChecked("HTML Display Services") ? 'block' : 'none';
    if(htmlDisp.style.display === 'none') htmlDisp.querySelectorAll('input').forEach(i=>{i.value=''; i.removeAttribute('required');});
    else document.getElementById('infoHtmlDisplayDetails').setAttribute('required', 'required');

    updateInfoDeviceTypes();
}

function toggleInfoConfigText() {
    var r = document.querySelector('input[name="infoConfigExists"]:checked')?.value;
    var textGrp = document.getElementById('infoConfigTextGroup');
    var noGrp = document.getElementById('infoConfigNoGroup');
    var nameInp = document.getElementById('infoConfigName');
    
    textGrp.style.display = (r === 'Yes') ? 'block' : 'none';
    noGrp.style.display = (r === 'No') ? 'block' : 'none';
    
    if (r === 'Yes') {
        nameInp.setAttribute('required', 'required');
    } else {
        nameInp.removeAttribute('required'); nameInp.value='';
    }
}

function updateInfoDeviceTypes() {
    var os = document.getElementById('infoOS')?.value;
    var isLegacy = (os === 'Legacy');
    var isVdv300 = document.querySelector('input[name="infoProtocol"][value="VDV 300"]')?.checked;
    var isMandatory = document.querySelector('.sec7-req-label').classList.contains('required');
    var count = parseInt(document.getElementById('infoCount').value) || 0;

    for(let i=1; i<=count; i++) {
        let row = document.getElementById(`infoVdv300Dynamic_${i}`);
        let typeGrp = document.getElementById(`infoDeviceTypeGroup_${i}`);
        let typeSel = document.getElementById(`infoDeviceType_${i}`);
        let addGrp = document.getElementById(`infoAddressGroup_${i}`);
        let addInp = document.getElementById(`infoAddress_${i}`);
        let typeLbl = document.getElementById(`infoDeviceTypeLabel_${i}`);
        let addLbl = document.getElementById(`infoAddressLabel_${i}`);
        
        if(!row) continue;
        
        row.style.display = (isLegacy || isVdv300) ? 'grid' : 'none';
        typeGrp.style.display = (isLegacy || isVdv300) ? 'block' : 'none';
        addGrp.style.display = isVdv300 ? 'block' : 'none';

        if (isLegacy || isVdv300) {
            var currentTypeVal = typeSel.value;
            if(isLegacy) {
                typeSel.innerHTML = '<option value="">-- Select Type --</option><option value="ID 1">ID 1</option><option value="ID 2">ID 2</option><option value="ID 3">ID 3</option><option value="ID 4">ID 4</option><option value="ID 5">ID 5</option><option value="ID 6">ID 6</option><option value="ID 7">ID 7</option>';
            } else if (isVdv300) {
                typeSel.innerHTML = '<option value="">-- Select Type --</option><option value="Standalone">Standalone</option><option value="Medi-Master">Medi-Master</option><option value="Medi-Slave">Medi-Slave</option>';
            }
            if(Array.from(typeSel.options).some(opt => opt.value === currentTypeVal)) typeSel.value = currentTypeVal;
            
            if(isMandatory) { typeSel.setAttribute('required', 'required'); typeLbl.classList.add('required'); }
            else { typeSel.removeAttribute('required'); typeLbl.classList.remove('required'); }
        } else {
            typeSel.removeAttribute('required'); typeSel.value = ''; typeLbl.classList.remove('required');
        }

        if (isVdv300) {
            if(isMandatory) { addInp.setAttribute('required', 'required'); addLbl.classList.add('required'); }
            else { addInp.removeAttribute('required'); addLbl.classList.remove('required'); }
        } else {
            addInp.removeAttribute('required'); addInp.value = ''; addLbl.classList.remove('required');
        }
    }
}

function generateInfotainment() {
    var count = parseInt(document.getElementById('infoCount').value) || 0;
    var cont = document.getElementById('dynamicInfoContainer');
    var mode = document.querySelector('input[name="infoNetMode"]:checked')?.value;
    var isMandatory = document.querySelector('.sec7-req-label').classList.contains('required');
    
    var showIp = (mode === 'Fixed');
    var reqAttr = isMandatory ? 'required' : '';
    var reqClass = isMandatory ? 'class="required"' : '';
    var ipReqAttr = (isMandatory && showIp) ? 'required' : '';

    cont.innerHTML = '';
    if (isNaN(count) || count === 0) { buildTopology(); return; }

    for (let i = 1; i <= count; i++) {
        let html = `<div class="dynamic-box"><h4>Infotainment Device ${i}</h4>
            <div class="form-row">
                <div class="form-group"><label for="infoItemNumber_${i}">Item Number</label><input type="text" id="infoItemNumber_${i}" name="infoItemNumber_${i}"></div>
                <div class="form-group"><label class="${reqClass}" for="infoResolution_${i}">Resolution</label><select id="infoResolution_${i}" name="infoResolution_${i}" ${reqAttr}>${infoResolutions}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label class="${reqClass}" for="infoPosition_${i}">Position</label><select id="infoPosition_${i}" name="infoPosition_${i}" ${reqAttr}>${infoPositions}</select></div>
                <div class="form-group info-ip-address-group" style="display:${showIp ? 'block' : 'none'};"><label class="required" for="infoIP_${i}">IP Address</label><input type="text" id="infoIP_${i}" name="infoIP_${i}" placeholder="e.g. 192.168.1.100" pattern="^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$" oninput="syncTopologyValue(this.id)" ${ipReqAttr}></div>
            </div>
            <div class="form-row info-vdv300-dynamic" id="infoVdv300Dynamic_${i}" style="display:none;">
                <div class="form-group" id="infoDeviceTypeGroup_${i}"><label class="${reqClass}" id="infoDeviceTypeLabel_${i}" for="infoDeviceType_${i}">Device Type</label><select id="infoDeviceType_${i}" name="infoDeviceType_${i}"></select></div>
                <div class="form-group" id="infoAddressGroup_${i}"><label class="${reqClass}" id="infoAddressLabel_${i}" for="infoAddress_${i}">IBIS Address</label><input type="text" id="infoAddress_${i}" name="infoAddress_${i}"></div>
            </div>
        </div>`;
        cont.insertAdjacentHTML('beforeend', html);
    }
    buildTopology();
}

function toggleCctvSystemHint() {
    document.getElementById('nvmHint').style.display = (document.querySelector('input[name="cctvSystem"]:checked')?.value === 'NVM') ? 'block' : 'none';
}

function handleCctvXsuiteChange() {
    var val = document.querySelector('input[name="cctvXsuite"]:checked')?.value;
    var part = document.getElementById('cctvRecorderPart');
    if (val === 'Yes') {
        part.style.display = 'none';
        part.querySelectorAll('input, select').forEach(el => {
            el.removeAttribute('required');
            if(el.type==='radio' || el.type==='checkbox') el.checked = false;
            else el.value = '';
        });
    } else {
        part.style.display = 'block';
        document.getElementById('cctvRecType').setAttribute('required', 'required');
        document.getElementById('cctvRecOrient').setAttribute('required', 'required');
        document.querySelectorAll('input[name="cctvRecNetMode"]').forEach(r => r.setAttribute('required', 'required'));
        handleCctvRecNetMode();
    }
    buildTopology();
}

function handleCctvRecNetMode() {
    var mode = document.querySelector('input[name="cctvRecNetMode"]:checked')?.value;
    var group = document.getElementById('cctvRecIpGroup');
    var inp = document.getElementById('cctvRecIP');
    if(mode === 'Fixed') {
        group.style.display = 'block';
        inp.setAttribute('required', 'required');
    } else {
        group.style.display = 'none';
        inp.removeAttribute('required');
    }
    buildTopology();
}

function handleCamNetMode() {
    var mode = document.querySelector('input[name="camNetMode"]:checked')?.value;
    var isFixed = (mode === 'Fixed');
    document.querySelectorAll('.cctv-cam-ip-group').forEach(function(g) {
        g.style.display = isFixed ? 'block' : 'none';
        var inp = g.querySelector('input[type="text"]');
        if(isFixed) inp.setAttribute('required', 'required');
        else inp.removeAttribute('required');
    });
    buildTopology();
}

function handleSwitchType() {
    document.getElementById('managedSwitchFields').style.display = (document.querySelector('input[name="switchType"]:checked')?.value === 'Managed') ? 'block' : 'none';
}

function generateCctvCameras() {
    var count = parseInt(document.getElementById('cctvCamCount').value) || 0;
    var mode = document.querySelector('input[name="camNetMode"]:checked')?.value;
    var cont = document.getElementById('cctvCamerasContainer');
    var showIp = (mode === 'Fixed');
    
    cont.innerHTML = '';
    if (isNaN(count) || count === 0) { buildTopology(); return; }
    
    for(let i=1; i<=count; i++) {
        let html = `<div class="dynamic-box"><h4>Camera ${i}</h4>
            <div class="form-row">
                <div class="form-group"><label class="required" for="cctvCamPos_${i}">Position</label><select id="cctvCamPos_${i}" name="cctvCamPos_${i}" required><option value="">-- Select --</option><option value="Front">Front</option><option value="Middle">Middle</option><option value="Rear">Rear</option></select></div>
                <div class="form-group"><label>Doors (Y/N)</label><div class="checkbox-group" style="margin-top:10px;"><label><input type="checkbox" id="cctvCamDoor_${i}" name="cctvCamDoor_${i}" value="Yes"> Yes</label></div></div>
            </div>
            <div class="form-group cctv-cam-ip-group" style="display:${showIp ? 'block' : 'none'};"><label class="required" for="cctvCamIP_${i}">Camera IP</label><input type="text" id="cctvCamIP_${i}" name="cctvCamIP_${i}" pattern="^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$" title="Please enter a valid IP address" placeholder="e.g. 192.168.1.150" oninput="syncTopologyValue(this.id)" ${showIp ? 'required' : ''}></div>
        </div>`;
        cont.insertAdjacentHTML('beforeend', html);
    }
    buildTopology();
}