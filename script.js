// --- DOM Elements ---
// (Keep all DOM element selections as they are necessary)
const playlistNameInput = document.getElementById('playlistName');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const playlistListEl = document.getElementById('playlistList');
const playlistSearchInput = document.getElementById('playlistSearch');
const noPlaylistsMessageEl = document.getElementById('noPlaylistsMessage');
const videoUrlInput = document.getElementById('videoUrl');
const addVideoBtn = document.getElementById('addVideoBtn');
const videoGridEl = document.getElementById('videoGrid');
const currentPlaylistTitleEl = document.getElementById('currentPlaylistTitle');
const videoFormEl = document.getElementById('videoForm');
const playerWrapperEl = document.getElementById('playerWrapper');
const videoPlaceholderEl = document.getElementById('videoPlaceholder');
const playlistActionsEl = document.getElementById('playlistActions');
const autoplayToggle = document.getElementById('autoplayToggle'); // Direct reference to checkbox
const autoplaySwitchDiv = document.querySelector('.control-group .switch'); // For visual click
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const importFileEl = document.getElementById('importFile');
const toastContainerEl = document.getElementById('toastContainer');
const htmlEl = document.documentElement;
const bodyEl = document.body; // Keep if needed elsewhere, otherwise potentially remove
const closePlayerBtn = document.getElementById('closePlayerBtn');
const sidebarEl = document.querySelector('.sidebar');
const sidebarResizerEl = document.getElementById('sidebarResizer');
const shufflePlaylistBtn = document.getElementById('shufflePlaylistBtn');
// Pagination Elements
const paginationControlsEl = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');

// --- State ---
let playlists = [];
let currentPlaylistId = null;
let ytPlayer = null;
let isPlayerReady = false;
let videoIdToPlayOnReady = null; // Video ID queued before player ready
let isAutoplayEnabled = false;
let currentlyPlayingVideoId = null; // ID of the video successfully playing
let intendedVideoId = null;       // ID of the video we are trying to play/load
let draggedVideoId = null;        // ID of the video being dragged (mouse/touch)
let dragTargetElement = null;     // Element we are dragging over (mouse/touch)
let currentTheme = 'light';
let isResizing = false;
// Touch drag state - simplified, combined with mouse drag state where possible
let isTouchDragging = false;
let touchDragStartY = 0;
let touchDraggedElement = null;
// Pagination State
const VIDEOS_PER_PAGE = 20;
let currentPage = 1;
// Web Audio Keep-Alive
let audioContext = null;
let silentSource = null;

// --- Icons ---
// (Keep ICONS object as is)
const ICONS = {
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>`,
    loading: `<span class="spinner"></span>`,
    rename: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`,
    drag: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`
};

// --- Initialization ---
function init() {
    loadTheme();
    loadPlaylists();
    loadAutoplaySetting();
    loadSidebarWidth();
    setupEventListeners(); // Setup listeners early
    updateThemeIcon(); // Set initial theme icon

    // YouTube API script is loaded externally via <script> tag.
    // onYouTubeIframeAPIReady will be called automatically by the API when ready.

    const lastSelectedId = localStorage.getItem('lastSelectedPlaylistId');
    const playlistToSelect = playlists.find(p => p.id === parseInt(lastSelectedId)) || playlists[0];

    if (playlistToSelect) {
        selectPlaylist(playlistToSelect.id);
    } else {
        updateUIForNoSelection();
    }
    renderPlaylists(); // Initial playlist render

    // Keep Visibility listener for potential future use or robust audio context handling
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            startSilentAudio(); // Try to keep context alive when returning to tab
        }
    });
}

// --- Local Storage & State Helpers ---
const Storage = {
    get: (key, defaultValue = null) => JSON.parse(localStorage.getItem(key)) ?? defaultValue,
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    getRaw: (key, defaultValue = null) => localStorage.getItem(key) ?? defaultValue,
    setRaw: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key)
};

function savePlaylistsState() { Storage.set('playlists', playlists); }
function loadPlaylists() {
    playlists = Storage.get('playlists', []);
    // Ensure structure consistency
    playlists.forEach(p => { if (!Array.isArray(p.videos)) p.videos = []; });
}

function saveAutoplaySetting() { Storage.setRaw('autoplayEnabled', isAutoplayEnabled); }
function loadAutoplaySetting() {
    isAutoplayEnabled = Storage.getRaw('autoplayEnabled') === 'true';
    autoplayToggle.checked = isAutoplayEnabled;
}

function saveLastSelectedPlaylist(id) { Storage.setRaw('lastSelectedPlaylistId', id ? String(id) : ''); }

function saveSidebarWidth(width) { Storage.setRaw('sidebarWidth', width); }
function loadSidebarWidth() {
    const savedWidth = Storage.getRaw('sidebarWidth');
    if (savedWidth) {
        sidebarEl.style.width = savedWidth + 'px';
    }
}

// --- Helper Function ---
function getCurrentPlaylist() {
    return playlists.find(p => p.id === currentPlaylistId);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
    playlistNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleCreatePlaylist(); });
    addVideoBtn.addEventListener('click', handleAddVideo);
    videoUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !addVideoBtn.disabled) handleAddVideo(); });
    videoUrlInput.addEventListener('input', () => { addVideoBtn.disabled = videoUrlInput.value.trim() === ''; });
    autoplayToggle.addEventListener('change', handleAutoplayToggle);
    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick); // Handles clicks on the visual switch area
    clearPlaylistBtn.addEventListener('click', handleClearPlaylist);
    themeToggleBtn.addEventListener('click', toggleTheme);
    shufflePlaylistBtn.addEventListener('click', handleShufflePlaylist);
    playlistSearchInput.addEventListener('input', debounce(handlePlaylistSearch, 300));
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportPlaylists);
    exportBtn.addEventListener('click', handleExportPlaylists);
    sidebarResizerEl.addEventListener('mousedown', initSidebarResize);
    closePlayerBtn.addEventListener('click', handleClosePlayer);

    // --- Event Delegation ---
    playlistListEl.addEventListener('click', handlePlaylistListActions);
    videoGridEl.addEventListener('click', handleVideoGridClick);

    // --- Drag and Drop (Mouse & Touch) ---
    setupDragAndDropListeners();
    setupTouchDragListeners(); // Separate setup for touch

    // --- Pagination ---
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
}

// --- Playlist List Event Handler (Delegation) ---
function handlePlaylistListActions(event) {
    const playlistItem = event.target.closest('.playlist-item');
    if (!playlistItem) return;
    const playlistId = parseInt(playlistItem.dataset.id);

    if (event.target.closest('.rename-btn')) {
        event.stopPropagation(); handleRenamePlaylist(playlistId);
    } else if (event.target.closest('.delete-btn')) {
        event.stopPropagation(); handleDeletePlaylist(playlistId);
    } else {
        selectPlaylist(playlistId);
    }
}

// --- Video Grid Event Handler (Delegation) ---
function handleVideoGridClick(event) {
    const videoCard = event.target.closest('.video-card');
    if (!videoCard) return;
    const videoId = videoCard.dataset.videoId;

    if (event.target.closest('.delete-video-btn')) {
        event.stopPropagation(); handleDeleteVideo(videoId);
    } else if (!event.target.closest('.drag-handle')) { // Don't play if clicking the handle
        playVideo(videoId);
    }
}

// --- Pagination Control ---
function changePage(delta) {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist) return;
    const totalPages = Math.ceil(currentPlaylist.videos.length / VIDEOS_PER_PAGE);
    const newPage = currentPage + delta;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderVideos(); // Re-render videos for the new page
    }
}

// --- Sidebar Resizing ---
// (Keep initSidebarResize, handleSidebarResize, stopSidebarResize as they are standard)
function initSidebarResize(e) {
    isResizing = true;
    sidebarResizerEl.classList.add('resizing');
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
}

function handleSidebarResize(e) {
    if (!isResizing) return;
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const minWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width'));
    const maxWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width'));
    const newWidth = Math.max(minWidth, Math.min(e.clientX - containerRect.left, maxWidth));
    sidebarEl.style.width = newWidth + 'px';
}

function stopSidebarResize() {
    if (!isResizing) return; // Prevent saving if not resizing
    isResizing = false;
    sidebarResizerEl.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleSidebarResize);
    document.removeEventListener('mouseup', stopSidebarResize);
    saveSidebarWidth(sidebarEl.getBoundingClientRect().width);
}

// --- Drag and Drop (Mouse) ---
function setupDragAndDropListeners() {
    videoGridEl.addEventListener('dragstart', handleDragStart);
    videoGridEl.addEventListener('dragend', handleDragEnd);
    videoGridEl.addEventListener('dragover', handleDragOver);
    videoGridEl.addEventListener('dragleave', handleDragLeave);
    videoGridEl.addEventListener('drop', handleDrop);
}

function handleDragStart(event) {
    const videoCard = event.target.closest('.video-card[draggable="true"]');
    if (videoCard) {
        draggedVideoId = videoCard.dataset.videoId;
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => videoCard.classList.add('dragging'), 0);
    } else {
        event.preventDefault(); // Prevent dragging if not on a draggable element
    }
}

function handleDragEnd(event) {
    const draggingElement = videoGridEl.querySelector('.video-card.dragging');
    if (draggingElement) draggingElement.classList.remove('dragging');
    clearDragOverStyles();
    draggedVideoId = null;
    dragTargetElement = null;
}

function handleDragOver(event) {
    event.preventDefault();
    if (!draggedVideoId) return;

    const targetCard = event.target.closest('.video-card');
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        if (dragTargetElement !== targetCard) {
            clearDragOverStyles();
            targetCard.classList.add('drag-over');
            dragTargetElement = targetCard;
        }
        event.dataTransfer.dropEffect = 'move';
    } else {
        if (dragTargetElement) { // Clear if over empty space or self
            clearDragOverStyles();
            dragTargetElement = null;
        }
        event.dataTransfer.dropEffect = 'none';
    }
}

function handleDragLeave(event) {
    const targetCard = event.target.closest('.video-card');
    // Only clear if leaving the specific target we were over
    if (targetCard && targetCard === dragTargetElement && !targetCard.contains(event.relatedTarget)) {
        clearDragOverStyles();
        dragTargetElement = null;
    }
}

function handleDrop(event) {
    event.preventDefault();
    clearDragOverStyles();
    const targetCard = event.target.closest('.video-card');
    const dropTargetId = targetCard ? targetCard.dataset.videoId : null; // Can be null if dropped in empty space

    if (draggedVideoId && dropTargetId !== draggedVideoId) { // Ensure dropTargetId is not the dragged item itself
        handleReorderVideo(draggedVideoId, dropTargetId);
    }
    // Reset state regardless of successful drop
    draggedVideoId = null;
    dragTargetElement = null;
}

function clearDragOverStyles() {
    videoGridEl.querySelectorAll('.video-card.drag-over').forEach(card => card.classList.remove('drag-over'));
}

// --- Drag and Drop (Touch) ---
function setupTouchDragListeners() {
    videoGridEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    videoGridEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    videoGridEl.addEventListener('touchend', handleTouchEnd);
    videoGridEl.addEventListener('touchcancel', handleTouchEnd);
}

function handleTouchStart(event) {
    const targetCard = event.target.closest('.video-card[draggable="true"]');
    const dragHandle = event.target.closest('.drag-handle');

    if (targetCard && dragHandle) {
        isTouchDragging = true;
        draggedVideoId = targetCard.dataset.videoId; // Use the same state var
        touchDraggedElement = targetCard; // Specific element being touched
        touchDragStartY = event.touches[0].clientY;
        touchDraggedElement.classList.add('dragging');
        // Optional: navigator.vibrate(50);
    } else {
        isTouchDragging = false; // Reset if touch didn't start on handle
    }
}

function handleTouchMove(event) {
    if (!isTouchDragging || !touchDraggedElement) return;
    event.preventDefault(); // Prevent scrolling

    const touch = event.touches[0];
    // Find element under touch
    touchDraggedElement.style.visibility = 'hidden';
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDraggedElement.style.visibility = '';

    const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card') : null;

    clearDragOverStyles(); // Use the same clearing function

    if (targetCard && targetCard !== touchDraggedElement) {
        targetCard.classList.add('drag-over');
        dragTargetElement = targetCard; // Use the same state var
    } else {
        dragTargetElement = null;
    }
    // Optional: Visual feedback like moving the element with touch
    // const deltaY = touch.clientY - touchDragStartY;
    // touchDraggedElement.style.transform = `translateY(${deltaY}px)`;
}

function handleTouchEnd(event) {
    if (!isTouchDragging || !touchDraggedElement) return;

    touchDraggedElement.classList.remove('dragging');
    // touchDraggedElement.style.transform = ''; // Reset visual transform if used
    clearDragOverStyles();

    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
        // Optional: navigator.vibrate(50);
    }

    // Reset all touch-related state
    isTouchDragging = false;
    draggedVideoId = null; // Reset shared state
    touchDraggedElement = null;
    dragTargetElement = null; // Reset shared state
    touchDragStartY = 0;
}


// --- Theme Management ---
// (Keep loadTheme, applyTheme, toggleTheme, updateThemeIcon as they are straightforward)
function loadTheme() {
    applyTheme(Storage.getRaw('uiTheme', 'light'));
}
function applyTheme(themeName) {
    currentTheme = themeName;
    htmlEl.dataset.theme = themeName;
    updateThemeIcon();
    Storage.setRaw('uiTheme', themeName);
}
function toggleTheme() {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}
function updateThemeIcon() {
    themeToggleBtn.innerHTML = currentTheme === 'dark' ? ICONS.sun : ICONS.moon;
    themeToggleBtn.title = currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
}

// --- YouTube Player API ---
// This function MUST be global
function onYouTubeIframeAPIReady() {
    console.log("YT API Ready.");
    if (document.getElementById('player')) {
        ytPlayer = new YT.Player('player', {
            height: '100%', width: '100%',
            playerVars: { 'playsinline': 1, 'rel': 0 },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } else {
        console.warn("Player element ('#player') not found.");
    }
}

function onPlayerReady(event) {
    console.log("Player Ready.");
    isPlayerReady = true;
    startSilentAudio(); // Start silent audio when player is ready
    setupMediaSessionActionHandlers(); // Setup MediaSession handlers
    if (videoIdToPlayOnReady) {
        const videoToPlay = videoIdToPlayOnReady;
        videoIdToPlayOnReady = null;
        playVideo(videoToPlay); // Play the queued video
    }
}

function onPlayerStateChange(event) {
    const state = event.data;
    const currentPlaylist = getCurrentPlaylist(); // Get playlist context if needed

    // Update Media Session state based on player state
    if ('mediaSession' in navigator) {
        switch (state) {
            case YT.PlayerState.PLAYING:
            case YT.PlayerState.BUFFERING: // Treat buffering as playing for media session
                navigator.mediaSession.playbackState = "playing";
                break;
            case YT.PlayerState.PAUSED:
                navigator.mediaSession.playbackState = "paused";
                break;
            case YT.PlayerState.ENDED:
            case YT.PlayerState.CUED: // Cued is ambiguous, maybe paused? Or none if nothing was intended?
            case YT.PlayerState.UNSTARTED:
            default:
                 navigator.mediaSession.playbackState = "none";
                 break; // Let specific logic below handle state more granularly if needed
        }
    }


    switch (state) {
        case YT.PlayerState.PLAYING:
            currentlyPlayingVideoId = intendedVideoId; // Confirm the intended video is now playing
            updatePlayingVideoHighlight(currentlyPlayingVideoId);
            startSilentAudio(); // Keep context active
            break;
        case YT.PlayerState.PAUSED:
            // Keep silent audio running for background resume
            startSilentAudio();
            break;
        case YT.PlayerState.ENDED:
            const endedVideoId = currentlyPlayingVideoId || intendedVideoId;
            currentlyPlayingVideoId = null;
            intendedVideoId = null; // Clear intention as video finished naturally
            updatePlayingVideoHighlight(null);
            if (isAutoplayEnabled) {
                startSilentAudio(); // Ensure context active before next play attempt
                playNextVideo(endedVideoId);
            } else {
                 if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "none";
            }
            break;
        // Other states (BUFFERING, CUED, UNSTARTED) don't require immediate action here,
        // but their MediaSession state is set above.
    }
}

function onPlayerError(event) {
    const erroredVideoId = intendedVideoId; // Capture the ID we were trying to play
    console.error(`YouTube Player Error: ${event.data} for video ID: ${erroredVideoId || 'unknown'}`);

    let errorMsg = `Player error code: ${event.data}`;
    switch (event.data) {
        case 2: errorMsg = 'Invalid video ID.'; break;
        case 5: errorMsg = 'HTML5 player error.'; break;
        case 100: errorMsg = 'Video not found (removed/private).'; break;
        case 101: case 150: errorMsg = 'Playback disallowed (embedding disabled).'; break;
    }
    showToast(`Player Error: ${errorMsg}`, 'error', 5000);

    // Reset state for the failed video
    if (erroredVideoId === currentlyPlayingVideoId) currentlyPlayingVideoId = null; // If it was somehow marked as playing
    if (erroredVideoId === intendedVideoId) intendedVideoId = null; // Clear the failed intention
    updatePlayingVideoHighlight(null);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';

    // Autoplay skip logic
    if (isAutoplayEnabled && erroredVideoId) {
        showToast(`Skipping to next video.`, 'info', 4000);
        setTimeout(() => playNextVideo(erroredVideoId), 500); // Delay slightly
    } else if (!isAutoplayEnabled) {
        // If not autoplaying, hide the player on error
        handleClosePlayer(); // Calls stopVideo which clears state
    }
}

// --- Playlist Management ---
function handleCreatePlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) { showToast('Please enter a playlist name.', 'error'); playlistNameInput.focus(); return; }
    const newPlaylist = { id: Date.now(), name: name, videos: [] };
    playlists.unshift(newPlaylist);
    savePlaylistsState();
    playlistSearchInput.value = ''; // Clear search
    renderPlaylists(); // Render updated list
    selectPlaylist(newPlaylist.id); // Select the new playlist
    playlistNameInput.value = '';
    showToast(`Playlist "${escapeHTML(name)}" created.`, 'success');
}

function handleDeletePlaylist(id) {
    const playlistIndex = playlists.findIndex(p => p.id === id);
    if (playlistIndex === -1) return;
    const playlistName = playlists[playlistIndex].name;

    if (!confirm(`Delete playlist "${escapeHTML(playlistName)}"? This cannot be undone.`)) return;

    playlists.splice(playlistIndex, 1);

    // If the deleted playlist was selected
    if (currentPlaylistId === id) {
        currentPlaylistId = null; // Clear selection
        const nextPlaylist = playlists[playlistIndex] || playlists[playlistIndex - 1] || playlists[0];
        if (nextPlaylist) {
            selectPlaylist(nextPlaylist.id); // Select adjacent or first
        } else {
            updateUIForNoSelection(); // No playlists left
        }
    }

    savePlaylistsState();
    renderPlaylists(); // Re-render potentially filtered list
    showToast(`Playlist "${escapeHTML(playlistName)}" deleted.`, 'info');
}

function handleRenamePlaylist(id) {
    const playlist = playlists.find(p => p.id === id); // Don't need getCurrentPlaylist here
    if (!playlist) return;
    const oldName = playlist.name;
    const newName = prompt('Enter new name:', oldName)?.trim(); // Use optional chaining and trim

    if (newName && newName !== oldName) {
        playlist.name = newName;
        savePlaylistsState();
        renderPlaylists(); // Re-render list
        if (currentPlaylistId === id) { // Update title if it was the selected one
            currentPlaylistTitleEl.textContent = escapeHTML(newName);
        }
        showToast(`Playlist renamed to "${escapeHTML(newName)}".`, 'info');
    }
}

function selectPlaylist(id) {
    const selectedPlaylist = playlists.find(p => p.id === id);
    if (!selectedPlaylist) {
        console.error("Attempted to select non-existent playlist ID:", id);
        updateUIForNoSelection();
        return;
    }

    currentPlaylistId = id;
    currentPage = 1; // Reset pagination
    saveLastSelectedPlaylist(id);
    playlistSearchInput.value = ''; // Clear search on selection

    // Update UI elements
    currentPlaylistTitleEl.textContent = escapeHTML(selectedPlaylist.name);
    videoFormEl.classList.remove('hidden');
    playlistActionsEl.classList.remove('hidden');
    addVideoBtn.disabled = videoUrlInput.value.trim() === '';
    videoPlaceholderEl.classList.add('hidden');
    playerWrapperEl.classList.add('hidden'); // Hide player on playlist switch
    stopVideo(); // Stop any current video and clear state

    renderPlaylists(); // Update active state in the list
    renderVideos(); // Render videos for the selected playlist
}

function handleClearPlaylist() {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        showToast('Playlist is already empty.', 'info');
        return;
    }
    if (!confirm(`Remove all videos from "${escapeHTML(currentPlaylist.name)}"?`)) return;

    currentPlaylist.videos = [];
    savePlaylistsState();
    stopVideo();
    handleClosePlayer(); // Ensure player is hidden
    renderVideos(); // Re-render empty grid/placeholder
    renderPlaylists(); // Update video count in sidebar
    showToast(`Cleared playlist "${escapeHTML(currentPlaylist.name)}".`, 'info');
}

function handlePlaylistSearch() {
    renderPlaylists(); // Re-render filtered list
}

function handleShufflePlaylist() {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist) { showToast('Select a playlist to shuffle.', 'info'); return; }
    if (currentPlaylist.videos.length < 2) { showToast('Need at least two videos to shuffle.', 'info'); return; }

    // Fisher-Yates Shuffle
    for (let i = currentPlaylist.videos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentPlaylist.videos[i], currentPlaylist.videos[j]] = [currentPlaylist.videos[j], currentPlaylist.videos[i]];
    }

    savePlaylistsState();
    currentPage = 1; // Reset to first page
    renderVideos();
    showToast(`Playlist "${escapeHTML(currentPlaylist.name)}" shuffled!`, 'success');
}

// --- Video Management ---
function updatePlayingVideoHighlight(videoId) {
    videoGridEl.querySelectorAll('.video-card.playing').forEach(card => card.classList.remove('playing'));
    if (videoId) {
        const currentVideoCard = videoGridEl.querySelector(`.video-card[data-video-id="${videoId}"]`);
        if (currentVideoCard) currentVideoCard.classList.add('playing');
    }
}

async function handleAddVideo() {
    const url = videoUrlInput.value.trim();
    const currentPlaylist = getCurrentPlaylist(); // Use helper
    if (!url) { showToast('Please enter a YouTube video URL.', 'error'); return; }
    if (!currentPlaylist) { showToast('No playlist selected.', 'error'); return; } // Should not happen

    const videoId = extractVideoId(url);
    if (!videoId) { showToast('Invalid YouTube URL.', 'error', 4000); videoUrlInput.focus(); return; }
    if (currentPlaylist.videos.some(v => v.id === videoId)) { showToast('Video already in this playlist.', 'info'); return; }

    // UI Feedback
    addVideoBtn.disabled = true;
    addVideoBtn.innerHTML = ICONS.loading + ' Adding...';
    videoUrlInput.disabled = true;

    try {
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (!response.ok) {
            let errorMsg = `Failed to fetch video info (HTTP ${response.status}).`;
            try { const errData = await response.json(); if (errData.error) errorMsg = errData.error; } catch (_) { }
            throw new Error(errorMsg);
        }
        const data = await response.json();
        if (data.error) throw new Error(data.error); // Handle noembed specific errors

        const video = {
            id: videoId,
            title: data.title || 'Untitled Video',
            thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, // Fallback
            url: `https://youtu.be/${videoId}` // Consistent short URL
        };

        currentPlaylist.videos.push(video);
        currentPage = Math.ceil(currentPlaylist.videos.length / VIDEOS_PER_PAGE); // Go to last page
        savePlaylistsState();
        renderVideos();
        renderPlaylists(); // Update count
        videoUrlInput.value = ''; // Clear input
        showToast(`Added "${escapeHTML(video.title)}"`, 'success');

    } catch (error) {
        console.error('Add video error:', error);
        showToast(`Error adding video: ${error.message || 'Unknown error'}`, 'error', 5000);
    } finally {
        // Restore button state
        addVideoBtn.innerHTML = ICONS.add + ' Add Video';
        videoUrlInput.disabled = false;
        addVideoBtn.disabled = videoUrlInput.value.trim() === ''; // Disable if input is empty now
        videoUrlInput.focus();
    }
}

function handleDeleteVideo(videoId) {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist) return;
    const videoIndex = currentPlaylist.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;

    const videoTitle = currentPlaylist.videos[videoIndex].title;

    // Stop if playing this video
    if (videoId === currentlyPlayingVideoId || videoId === intendedVideoId) {
        stopVideo();
        handleClosePlayer(); // Hide player too
    }

    currentPlaylist.videos.splice(videoIndex, 1);

    // Adjust pagination if needed
    const totalPages = Math.ceil(currentPlaylist.videos.length / VIDEOS_PER_PAGE);
    if (currentPlaylist.videos.length > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    } else if (currentPlaylist.videos.length === 0) {
        currentPage = 1;
    }

    savePlaylistsState();
    renderVideos();
    renderPlaylists(); // Update count
    showToast(`Removed "${escapeHTML(videoTitle)}".`, 'info');
}

function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist) return;

    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [videoToMoveData] = currentPlaylist.videos.splice(videoToMoveIndex, 1); // Remove

    const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);

    if (targetIndex !== -1) {
        currentPlaylist.videos.splice(targetIndex, 0, videoToMoveData); // Insert before target
    } else {
        // If target not found (e.g., dropped in empty space or error), append to end
        currentPlaylist.videos.push(videoToMoveData);
    }

    savePlaylistsState();
    // Re-render only if the order change affects the current page
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    if (videoToMoveIndex >= startIndex && videoToMoveIndex < endIndex ||
        (targetIndex !== -1 && targetIndex >= startIndex && targetIndex < endIndex) ||
         targetIndex === -1) { // Also re-render if moved to end (targetIndex -1)
         renderVideos();
    }
    // No toast needed for reorder
}

function playVideo(videoId) {
    if (!videoId) { console.error("playVideo: Invalid videoId."); return; }
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist) { console.error("playVideo: No current playlist."); return; }
    const videoData = currentPlaylist.videos.find(v => v.id === videoId);
    if (!videoData) { console.error(`playVideo: Video ${videoId} not found in playlist.`); return; }

    intendedVideoId = videoId; // Set intention *immediately*
    playerWrapperEl.classList.remove('hidden');
    updatePlayingVideoHighlight(videoId); // Highlight immediately

    // Update Media Session metadata
    if ('mediaSession' in navigator) {
        updateMediaSessionMetadata(videoData);
        navigator.mediaSession.playbackState = "playing"; // Optimistic state
    }

    // Ensure silent audio context is active before playback attempt
    startSilentAudio();

    if (ytPlayer && isPlayerReady) {
        try {
            ytPlayer.loadVideoById(videoId);
            // ytPlayer.playVideo(); // Optional: Force play? Usually loadVideoById autoplays if allowed.
        } catch (error) {
            console.error("playVideo: Error calling loadVideoById:", error);
            showToast("Failed to load video.", "error");
            handlePlayerErrorCleanup(videoId); // Use a common cleanup function
        }
    } else {
        videoIdToPlayOnReady = videoId; // Queue for when player is ready
    }
}

function playNextVideo(previousVideoId) {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist || currentPlaylist.videos.length < 1) {
        handleClosePlayer();
        return;
    }

    let currentIndex = -1;
    if (previousVideoId) {
        currentIndex = currentPlaylist.videos.findIndex(v => v.id === previousVideoId);
    }

    // If previous video not found, or no previous ID, play the first video
    if (currentIndex === -1 && currentPlaylist.videos.length > 0) {
        playVideo(currentPlaylist.videos[0].id);
        return;
    }

    // Calculate next index, wrapping around
    const nextIndex = (currentIndex + 1) % currentPlaylist.videos.length;
    const nextVideo = currentPlaylist.videos[nextIndex];

    if (nextVideo) {
        playVideo(nextVideo.id);
    } else {
        // Should not happen with modulo logic if list isn't empty
        console.error("playNextVideo: Could not determine next video. Stopping.");
        handleClosePlayer();
    }
}

function playPreviousVideo(currentVideoId) {
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist || currentPlaylist.videos.length < 1) {
        handleClosePlayer();
        return;
    }

    let currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentVideoId);

    // If current video not found, play the last video
    if (currentIndex === -1 && currentPlaylist.videos.length > 0) {
        playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id);
        return;
    }

    // Calculate previous index, wrapping around
    const previousIndex = (currentIndex - 1 + currentPlaylist.videos.length) % currentPlaylist.videos.length;
    const previousVideo = currentPlaylist.videos[previousIndex];

    if (previousVideo) {
        playVideo(previousVideo.id);
    } else {
        console.error("playPreviousVideo: Could not determine previous video. Stopping.");
        handleClosePlayer();
    }
}

function stopVideo() {
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        try {
            // Only stop if player is in a state that allows stopping
            const state = typeof ytPlayer.getPlayerState === 'function' ? ytPlayer.getPlayerState() : -1;
            if (state !== YT.PlayerState.UNSTARTED && state !== -1 && state !== YT.PlayerState.ENDED) {
                ytPlayer.stopVideo();
            }
        } catch (e) {
            console.warn("Error calling ytPlayer.stopVideo():", e);
        }
    }
    // Clear playback state variables
    currentlyPlayingVideoId = null;
    intendedVideoId = null;
    videoIdToPlayOnReady = null;
    updatePlayingVideoHighlight(null);
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        // Metadata is cleared by handleClosePlayer or when playing next video
    }
}

// Helper for cleaning up player state after errors or closure
function handlePlayerErrorCleanup(videoId) {
    if (videoId === currentlyPlayingVideoId) currentlyPlayingVideoId = null;
    if (videoId === intendedVideoId) intendedVideoId = null;
    if (videoId === videoIdToPlayOnReady) videoIdToPlayOnReady = null;
    updatePlayingVideoHighlight(null);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
    // Don't necessarily hide player here, onError/handleClosePlayer decides that
}

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// --- Rendering ---
function renderPlaylists() {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    const filteredPlaylists = playlists.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (filteredPlaylists.length === 0) {
        playlistListEl.innerHTML = ''; // Clear list
        noPlaylistsMessageEl.textContent = searchTerm ? 'No playlists match search.' : 'No playlists created yet.';
        noPlaylistsMessageEl.classList.remove('hidden');
    } else {
        noPlaylistsMessageEl.classList.add('hidden');
        const fragment = document.createDocumentFragment();
        filteredPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = `playlist-item ${playlist.id === currentPlaylistId ? 'active' : ''}`;
            li.dataset.id = playlist.id;
            // Simplified innerHTML setting
            li.innerHTML = `
                <span class="playlist-name">${escapeHTML(playlist.name)}</span>
                <span class="playlist-count">${playlist.videos.length}</span>
                <div class="controls">
                    <button class="icon-button rename-btn" title="Rename Playlist">${ICONS.rename}<span class="visually-hidden">Rename ${escapeHTML(playlist.name)}</span></button>
                    <button class="icon-button delete-btn" title="Delete Playlist">${ICONS.delete}<span class="visually-hidden">Delete ${escapeHTML(playlist.name)}</span></button>
                </div>`;
            fragment.appendChild(li);
        });
        playlistListEl.innerHTML = ''; // Clear before appending
        playlistListEl.appendChild(fragment);
    }
}

function renderVideos() {
    const currentPlaylist = getCurrentPlaylist();

    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        videoGridEl.innerHTML = '';
        paginationControlsEl.classList.add('hidden');
        videoPlaceholderEl.textContent = currentPlaylist ? `Playlist "${escapeHTML(currentPlaylist.name)}" is empty.` : 'Select or create a playlist.';
        videoPlaceholderEl.classList.remove('hidden');
        updatePlayingVideoHighlight(null); // Ensure no highlight on empty
        return;
    }

    videoPlaceholderEl.classList.add('hidden');
    const totalVideos = currentPlaylist.videos.length;
    const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

    // Validate currentPage
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    const videosToRender = currentPlaylist.videos.slice(startIndex, endIndex);

    const fragment = document.createDocumentFragment();
    videosToRender.forEach(video => {
        const div = document.createElement('div');
        // Set properties directly on the created element
        div.className = `video-card ${video.id === currentlyPlayingVideoId ? 'playing' : ''}`; // Add playing class here directly
        div.dataset.videoId = video.id;
        div.draggable = true;
        div.innerHTML = `
            <div class="thumbnail-wrapper">
                <img src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy">
            </div>
            <div class="video-info">
                <h4>${escapeHTML(video.title)}</h4>
                <div class="video-controls">
                    <span class="drag-handle" title="Drag to reorder">${ICONS.drag}<span class="visually-hidden">Reorder</span></span>
                    <button class="icon-button delete-video-btn" title="Remove from playlist">${ICONS.delete}<span class="visually-hidden">Remove</span></button>
                </div>
            </div>`;
        fragment.appendChild(div);
    });

    videoGridEl.innerHTML = ''; // Clear before append
    videoGridEl.appendChild(fragment);
    renderPaginationControls(totalVideos, totalPages);
    // Ensure highlight is correct after render (in case currently playing video was on another page)
    updatePlayingVideoHighlight(currentlyPlayingVideoId);
}


function renderPaginationControls(totalVideos, totalPages) {
    if (totalVideos <= VIDEOS_PER_PAGE) {
        paginationControlsEl.classList.add('hidden');
    } else {
        paginationControlsEl.classList.remove('hidden');
        pageInfoEl.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
}

// --- UI Updates ---
function updateUIForNoSelection() {
    currentPlaylistId = null;
    saveLastSelectedPlaylist(null); // Save cleared state

    currentPlaylistTitleEl.textContent = 'No playlist selected';
    videoFormEl.classList.add('hidden');
    playlistActionsEl.classList.add('hidden');
    addVideoBtn.disabled = true;
    videoGridEl.innerHTML = '';
    paginationControlsEl.classList.add('hidden');
    handleClosePlayer(); // Stop video and hide player
    videoPlaceholderEl.textContent = 'Create or select a playlist.';
    videoPlaceholderEl.classList.remove('hidden');

    renderPlaylists(); // Update playlist list (no active item)
}

function handleAutoplayToggle() {
    isAutoplayEnabled = autoplayToggle.checked;
    saveAutoplaySetting();
    showToast(`Autoplay ${isAutoplayEnabled ? 'enabled' : 'disabled'}.`, 'info');
}

function handleVisualSwitchClick(event) {
    // If the click is on the visual part (not the hidden input), toggle the input's state.
    if (event.target !== autoplayToggle) {
        autoplayToggle.click(); // Programmatically click the checkbox to trigger its change event
    }
}

// --- Import / Export ---
// (Keep handleExportPlaylists and handleImportPlaylists largely as is, they use standard APIs)
function handleExportPlaylists() {
    if (playlists.length === 0) { showToast('No playlists to export.', 'info'); return; }
    try {
        const dataStr = JSON.stringify(playlists, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `playlists_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url); // Clean up blob URL
        link.remove(); // Clean up link element
        showToast('Playlists exported.', 'success');
    } catch (error) {
        console.error("Export error:", error);
        showToast('Failed to export playlists.', 'error');
    }
}

function handleImportPlaylists(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Invalid format: Not an array.");

            let addedCount = 0, skippedCount = 0;
            const existingIds = new Set(playlists.map(p => p.id));

            importedData.forEach(p => {
                // Basic validation
                if (!p || typeof p.id === 'undefined' || typeof p.name !== 'string') {
                    skippedCount++; return;
                }
                // Ensure videos array exists and filter invalid videos
                p.videos = Array.isArray(p.videos)
                    ? p.videos.filter(v => v && typeof v.id === 'string' && typeof v.title === 'string')
                    : [];

                if (!existingIds.has(p.id)) {
                    playlists.push(p);
                    existingIds.add(p.id);
                    addedCount++;
                } else {
                    skippedCount++; // Simple merge: skip duplicates
                }
            });

            if (addedCount > 0) savePlaylistsState();
            playlistSearchInput.value = ''; // Clear search
            renderPlaylists();
            showToast(`Imported ${addedCount} playlists. Skipped ${skippedCount}.`, 'success');
            // Select first playlist if none was selected
            if (!currentPlaylistId && playlists.length > 0) {
                selectPlaylist(playlists[0].id);
            }
        } catch (error) {
            console.error("Import error:", error);
            showToast(`Import failed: ${error.message}`, 'error');
        } finally {
            importFileEl.value = ''; // Reset file input
        }
    };
    reader.onerror = () => { showToast('Error reading file.', 'error'); importFileEl.value = ''; };
    reader.readAsText(file);
}

// --- Utility Functions ---
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // info, success, error
    const icon = ICONS[type] || ICONS.info;
    toast.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`;
    toastContainerEl.appendChild(toast);

    // Animate in & schedule removal
    requestAnimationFrame(() => {
        toast.classList.add('show');
        const timeoutId = setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
        // Click to dismiss early
        toast.addEventListener('click', () => {
            clearTimeout(timeoutId);
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, { once: true }); // Listener removed after click
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function handleClosePlayer() {
    stopVideo();
    playerWrapperEl.classList.add('hidden');
    if ('mediaSession' in navigator) {
        updateMediaSessionMetadata(null); // Clear metadata
        navigator.mediaSession.playbackState = 'none';
    }
}

// --- Media Session API ---
function updateMediaSessionMetadata(video) {
    if (!('mediaSession' in navigator)) return;

    if (!video) {
        navigator.mediaSession.metadata = null;
        // State is handled elsewhere (stopVideo, onStateChange)
        return;
    }

    const currentPlaylist = getCurrentPlaylist();
    const playlistName = currentPlaylist ? currentPlaylist.name : 'Playlist';

    navigator.mediaSession.metadata = new MediaMetadata({
        title: video.title,
        artist: 'YouTube', // Simplified
        album: playlistName,
        artwork: [
            // Prioritize higher quality thumbnails if potentially available
            { src: video.thumbnail.replace('mqdefault', 'hqdefault'), sizes: '480x360', type: 'image/jpeg' },
            { src: video.thumbnail, sizes: '320x180', type: 'image/jpeg' }, // mqdefault
        ]
    });
}

function setupMediaSessionActionHandlers() {
    if (!('mediaSession' in navigator)) return;

    const actions = {
        play: () => {
            startSilentAudio(); // Ensure context active
            if (ytPlayer && isPlayerReady && typeof ytPlayer.playVideo === 'function') {
                ytPlayer.playVideo();
            } else if (intendedVideoId || currentlyPlayingVideoId) {
                // If player not ready, try re-triggering playVideo for the last intended/playing ID
                playVideo(intendedVideoId || currentlyPlayingVideoId);
            }
             navigator.mediaSession.playbackState = "playing"; // Update state
        },
        pause: () => {
            if (ytPlayer && isPlayerReady && typeof ytPlayer.pauseVideo === 'function') {
                ytPlayer.pauseVideo();
            }
            startSilentAudio(); // Keep context active even when paused
             navigator.mediaSession.playbackState = "paused"; // Update state
        },
        stop: () => handleClosePlayer(), // Use existing close handler
        previoustrack: () => {
            startSilentAudio();
            playPreviousVideo(currentlyPlayingVideoId || intendedVideoId);
        },
        nexttrack: () => {
            startSilentAudio();
            playNextVideo(currentlyPlayingVideoId || intendedVideoId);
        }
    };

    // Set handlers using the actions object
    Object.keys(actions).forEach(action => {
        try {
            navigator.mediaSession.setActionHandler(action, actions[action]);
        } catch (error) {
            console.warn(`Could not set MediaSession action handler for ${action}:`, error);
        }
    });
}

// --- Silent Audio Hack ---
// (Keep startSilentAudio and manageSilentSource, but reduce logging)
function startSilentAudio() {
    if (!(window.AudioContext || window.webkitAudioContext)) return;

    const resumeAudio = () => {
        if (audioContext && audioContext.state === 'suspended') {
            // console.log("Attempting to resume AudioContext..."); // Keep commented unless debugging
            audioContext.resume().then(() => {
                // console.log("AudioContext resumed."); // Keep commented unless debugging
                manageSilentSource();
            }).catch(e => console.error("Error resuming AudioContext:", e));
        }
        // Clean up listeners after first interaction attempt
        ['click', 'touchstart', 'keydown'].forEach(evt =>
            document.removeEventListener(evt, resumeAudio, { capture: true })
        );
    };

    if (!audioContext || audioContext.state === 'closed') {
        try {
            // console.log("Creating new AudioContext."); // Keep commented unless debugging
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            silentSource = null;
            audioContext.onstatechange = () => {
                 // console.log("AudioContext state:", audioContext.state); // Keep commented unless debugging
                if (audioContext.state === 'suspended') {
                    ['click', 'touchstart', 'keydown'].forEach(evt => {
                         document.removeEventListener(evt, resumeAudio, { capture: true }); // Remove first
                         document.addEventListener(evt, resumeAudio, { once: true, capture: true });
                    });
                } else if (audioContext.state === 'running') {
                     manageSilentSource(); // Ensure source is running after resume/initial start
                }
            };
        } catch (e) {
            console.error("Web Audio API init failed:", e);
            audioContext = null; return;
        }
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => { // Try immediate resume
            // console.log("Immediate resume failed, adding interaction listeners."); // Keep commented unless debugging
            ['click', 'touchstart', 'keydown'].forEach(evt => {
                document.removeEventListener(evt, resumeAudio, { capture: true }); // Remove first
                document.addEventListener(evt, resumeAudio, { once: true, capture: true });
            });
        });
        return; // Don't manage source until resumed
    }

    if (audioContext.state === 'running') {
        manageSilentSource();
    }
}

function manageSilentSource() {
    if (!audioContext || audioContext.state !== 'running') return;

    // Stop existing source if it exists and is playing/scheduled
    if (silentSource) {
        try {
            silentSource.stop();
            silentSource.disconnect();
        } catch (e) { /* Ignore errors */ }
        silentSource = null;
    }

    // Create and start a new silent buffer source
    try {
        silentSource = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 1, audioContext.sampleRate); // 1 sec silent buffer
        silentSource.buffer = buffer;
        silentSource.loop = true;
        silentSource.connect(audioContext.destination);
        // Use GainNode to ensure silence (optional but safer)
        // const gainNode = audioContext.createGain();
        // gainNode.gain.value = 0;
        // silentSource.connect(gainNode);
        // gainNode.connect(audioContext.destination);
        silentSource.start(0);
    } catch (e) {
        console.error("Could not create/start silent audio source:", e);
        silentSource = null;
    }
}


// --- Start the app ---
init();