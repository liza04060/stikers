const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const stickersField = document.getElementById('stickersField');
const boardField = document.getElementById('boardField');
const clearButtons = document.querySelectorAll('.clear-btn');

const colors = [
    '#fff9c4', 
    '#c8e6c9', 
    '#bbdefb', 
    '#f8bbd0', 
    '#ffe0b2'  
];

let stickerCounter = 0;

function addSticker() {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Введите текст!');
        return;
    }

    createSticker(text, stickersField);
    taskInput.value = '';
    taskInput.focus();
}

function createSticker(text, parentElement) {
    stickerCounter++;

    const sticker = document.createElement('div');
    sticker.classList.add('sticker');
    sticker.draggable = true;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sticker.style.backgroundColor = randomColor;

    const randomRotate = Math.floor(Math.random() * 10) - 5; 
    sticker.style.transform = `rotate(${randomRotate}deg)`;

    const offset = (stickerCounter % 6) * 15;
    sticker.style.left = (10 + offset) + 'px';
    sticker.style.top  = (10 + offset) + 'px';

    const span = document.createElement('span');
    span.classList.add('sticker-text');
    span.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('sticker-delete');
    deleteBtn.textContent = '✕';

    sticker.append(span);
    sticker.append(deleteBtn);
    parentElement.append(sticker);

    deleteBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        sticker.remove();
    });

    attachDragAndDrop(sticker);
}

function attachDragAndDrop(sticker) {
    sticker.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'sticker');
        sticker.classList.add('dragging');
        sticker.style.zIndex = 999;
    });

    sticker.addEventListener('dragend', function () {
        sticker.classList.remove('dragging');
        sticker.style.zIndex = 10;
    });
}

const dropZones = [stickersField, boardField];

dropZones.forEach(function (zone) {
    zone.addEventListener('dragover', function (event) {
        event.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', function (event) {
        if (!zone.contains(event.relatedTarget)) {
            zone.classList.remove('drag-over');
        }
    });

    zone.addEventListener('drop', function (event) {
        event.preventDefault();
        zone.classList.remove('drag-over');

        const dragging = document.querySelector('.sticker.dragging');
        if (!dragging) return;

        const zoneRect = zone.getBoundingClientRect();
        
        let x = event.clientX - zoneRect.left - 55;
        let y = event.clientY - zoneRect.top  - 55;

        const maxX = zone.clientWidth - 110 - 10;
        const maxY = zone.clientHeight - 110 - 10;
        
        x = Math.max(10, Math.min(x, maxX));
        y = Math.max(10, Math.min(y, maxY));

        zone.append(dragging);
        dragging.style.left = x + 'px';
        dragging.style.top  = y + 'px';
    });
});

clearButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const targetId = btn.dataset.target;
        const targetZone = document.getElementById(targetId);
        
        targetZone.innerHTML = '';
    });
});

addBtn.addEventListener('click', addSticker);

taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addSticker();
    }
});