// ==========================================
//  1. CONFIGURATION: EDIT YOUR MENU HERE
// ==========================================
const menuData = [
    {
        category: "CBSE",
        items: [
            { name: "CBSE PRACTICAL 2026", id: "1t2r5JVBerkikb6lMn8CIPoEqzqiqm_6Z", tags: "Attendance & Relieving Certificate - For Practical Exam" },
            { name: "Class Notes", id: "PASTE_ID_HERE", tags: "Physics Maths Chemistry" },
            { name: "Syllabus Copy", id: "PASTE_ID_HERE", tags: "Exam 2026" }
        ]
    },
    {
        category: "Projects",
        items: [
            { name: "Physics Project", id: "PASTE_ID_HERE", tags: "Optics Electricity" },
            { name: "Chem Project", id: "PASTE_ID_HERE", tags: "Organic Reactions" }
        ]
    },
    {
        category: "Personal",
        items: [
            { name: "Certificates", id: "PASTE_ID_HERE", tags: "Awards Merit" },
          
        ]
    }
];

// ==========================================
//  2. MENU BUILDER (AUTOMATIC)
// ==========================================
function renderMenu() {
    const root = document.getElementById('dynamic-menu-root');
    let html = '';

    menuData.forEach((group) => {
        html += `
        <div class="menu-group">
            <div class="menu-header" onclick="toggleGroup(this)">
                <span>${group.category}</span>
                <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <div class="submenu">
        `;

        group.items.forEach(item => {
            html += `
                <div class="nav-item" 
                     data-search="${item.tags}" 
                     onclick="loadFolder(this, '${item.id}', '${item.name}')">
                     ${item.name}
                </div>
            `;
        });

        html += `</div></div>`; // Close submenu and group
    });

    root.innerHTML = html;
}

// Initialize Menu on Load
renderMenu();

// ==========================================
//  3. CORE LOGIC
// ==========================================

function loadFolder(el, id, title) {
    if(id.includes('PASTE')) { alert("Setup Required: Open script.js and paste your Google Drive IDs."); return; }

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    
    document.getElementById('pageTitle').innerText = title;
    document.getElementById('homeScreen').classList.add('hidden');
    
    // Mobile: Close sidebar
    if(window.innerWidth < 768) toggleSidebar();

    const iframe = document.getElementById('driveFrame');
    const loader = document.getElementById('loader');

    loader.classList.add('show');
    iframe.classList.remove('loaded');

    iframe.src = `https://drive.google.com/embeddedfolderview?id=${id}#list`;

    iframe.onload = function() {
        loader.classList.remove('show');
        iframe.classList.add('loaded');
    }
}

function showHome() {
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('pageTitle').innerText = "Overview";
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if(window.innerWidth < 768) toggleSidebar();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
}

// Accordion Logic
function toggleGroup(header) {
    const parent = header.parentElement;
    const wasOpen = parent.classList.contains('open');
    document.querySelectorAll('.menu-group').forEach(group => group.classList.remove('open'));
    if(!wasOpen) parent.classList.add('open');
}

// Search Logic
function filterMenu() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const groups = document.querySelectorAll('.menu-group');

    groups.forEach(group => {
        let match = false;
        const items = group.querySelectorAll('.nav-item');
        
        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            const tags = item.getAttribute('data-search').toLowerCase();
            if(text.includes(input) || tags.includes(input)) {
                item.classList.remove('hidden');
                match = true;
            } else {
                item.classList.add('hidden');
            }
        });

        if(input !== "") {
            if(match) {
                group.classList.remove('hidden');
                group.classList.add('open');
            } else {
                group.classList.add('hidden');
                group.classList.remove('open');
            }
        } else {
            // Reset
            group.classList.remove('hidden');
            group.classList.remove('open');
            items.forEach(i => i.classList.remove('hidden'));
        }
    });
}

// ==========================================
//  4. SHORTCUTS & CONTEXT MENU
// ==========================================

// Ctrl+K Search
document.addEventListener('keydown', function(e) {
    if((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchBox').focus();
    }
});

// Custom Right Click
document.addEventListener('contextmenu', event => {
    event.preventDefault();
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'block';
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
});

// Hide Menu on Click
document.addEventListener('click', () => {
    document.getElementById('contextMenu').style.display = 'none';
});