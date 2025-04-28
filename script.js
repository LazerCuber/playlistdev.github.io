// DOM Elements
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
const autoplaySwitchDiv = document.querySelector('.control-group .switch');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const importFileEl = document.getElementById('importFile');
const toastContainerEl = document.getElementById('toastContainer');
const htmlEl = document.documentElement;
const bodyEl = document.body;
const closePlayerBtn = document.getElementById('closePlayerBtn');
const sidebarEl = document.querySelector('.sidebar');
const sidebarResizerEl = document.getElementById('sidebarResizer');
const shufflePlaylistBtn = document.getElementById('shufflePlaylistBtn'); // Added
const audioOnlyToggle = document.getElementById('audioOnlyToggle'); // Added
// Pagination Elements
const paginationControlsEl = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');

// --- State ---
let playlists = [];
let currentPlaylistId = null;
let ytPlayer = null;
let isPlayerReady = false; // New state variable
let videoIdToPlayOnReady = null; // New state variable
let isAutoplayEnabled = false;
let isAudioOnlyMode = false; // Added state for audio-only
let currentlyPlayingVideoId = null;
let draggedVideoId = null; // ID of the video being dragged
let dragTargetElement = null; // Element we are dragging over
let currentTheme = 'light';
let isResizing = false;
let lastSidebarWidth = null;
// Touch drag state
let isTouchDragging = false;
let touchDragStartY = 0;
let touchDraggedElement = null;
// Pagination State
const videosPerPage = 20; // Number of videos to show per page
let currentPage = 1;

// --- Icons (Replace with actual SVG content or library calls) ---
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
    loadAudioOnlySetting(); // Added
    loadSidebarWidth();
    renderPlaylists();

    // YouTube API script is loaded externally via <script> tag.
    // onYouTubeIframeAPIReady will be called automatically by the API when ready.

    const lastSelectedId = localStorage.getItem('lastSelectedPlaylistId');
    if (lastSelectedId && playlists.some(p => p.id === parseInt(lastSelectedId))) {
        selectPlaylist(parseInt(lastSelectedId));
    } else if (playlists.length > 0) {
        selectPlaylist(playlists[0].id);
    } else {
        updateUIForNoSelection();
    }

    setupEventListeners();
    updateThemeIcon(); // Set initial theme icon
}

// --- Sidebar Resizing Functions ---
function loadSidebarWidth() {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
        sidebarEl.style.width = savedWidth + 'px';
    }
}

function saveSidebarWidth(width) {
    localStorage.setItem('sidebarWidth', width);
}

function initSidebarResize(e) {
    isResizing = true;
    sidebarResizerEl.classList.add('resizing');
    document.body.style.userSelect = 'none'; // Prevent text selection while resizing
    lastSidebarWidth = sidebarEl.getBoundingClientRect().width;
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
}

function handleSidebarResize(e) {
    if (!isResizing) return;

    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const newWidth = Math.max(
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width')),
        Math.min(e.clientX - containerRect.left,
            parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width')))
    );

    sidebarEl.style.width = newWidth + 'px';
}

function stopSidebarResize() {
    isResizing = false;
    sidebarResizerEl.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleSidebarResize);
    document.removeEventListener('mouseup', stopSidebarResize);

    // Save the new width
    const currentWidth = sidebarEl.getBoundingClientRect().width;
    saveSidebarWidth(currentWidth);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
    playlistNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleCreatePlaylist(); });
    addVideoBtn.addEventListener('click', handleAddVideo);
    videoUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !addVideoBtn.disabled) handleAddVideo(); });
    videoUrlInput.addEventListener('input', () => { addVideoBtn.disabled = videoUrlInput.value.trim() === ''; }); // Enable/disable add button
    autoplayToggle.addEventListener('change', handleAutoplayToggle);
    audioOnlyToggle.addEventListener('change', handleAudioOnlyToggle); // Listener for the checkbox change

    // Attach the visual click handler to the parent .switch element for both toggles
    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    // Ensure we target the correct parent switch for audio-only as well
    const audioOnlySwitchDiv = audioOnlyToggle.closest('.switch');
    if (audioOnlySwitchDiv) {
        audioOnlySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    }

    clearPlaylistBtn.addEventListener('click', handleClearPlaylist);
    themeToggleBtn.addEventListener('click', toggleTheme);
    shufflePlaylistBtn.addEventListener('click', handleShufflePlaylist); // Added
    playlistSearchInput.addEventListener('input', debounce(handlePlaylistSearch, 300));
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportPlaylists);
    exportBtn.addEventListener('click', handleExportPlaylists);

    // Sidebar resize event
    sidebarResizerEl.addEventListener('mousedown', initSidebarResize);

    // Playlist Actions (Delegation)
    playlistListEl.addEventListener('click', (event) => {
        const playlistItem = event.target.closest('.playlist-item');
        if (!playlistItem) return;
        const playlistId = parseInt(playlistItem.dataset.id);

        if (event.target.closest('.rename-btn')) {
            event.stopPropagation(); handleRenamePlaylist(playlistId);
        } else if (event.target.closest('.delete-btn')) {
            event.stopPropagation(); handleDeletePlaylist(playlistId);
        } else if (!event.target.closest('.controls')) {
            selectPlaylist(playlistId);
        }
    });

    // Video Actions (Delegation on Grid)
    videoGridEl.addEventListener('click', (event) => {
        const videoCard = event.target.closest('.video-card');
        if (!videoCard) return;
        const videoId = videoCard.dataset.videoId;

        if (event.target.closest('.delete-video-btn')) {
            event.stopPropagation(); handleDeleteVideo(videoId);
        } else if (!event.target.closest('.drag-handle')) { // Don't play if clicking the handle
            playVideo(videoId);
        }
    });

    // Drag and Drop Event Listeners
    setupDragAndDropListeners();

    closePlayerBtn.addEventListener('click', handleClosePlayer); // Add listener for close button

    // --- Pagination Listeners ---
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderVideos(); // Re-render videos for the new page
            // renderPaginationControls() is called by renderVideos
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        if (!currentPlaylist) return;
        const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderVideos(); // Re-render videos for the new page
            // renderPaginationControls() is called by renderVideos
        }
    });

    // --- Touch Event Listeners for Drag/Drop ---
    videoGridEl.addEventListener('touchstart', handleTouchStart, { passive: false }); // Need passive: false for preventDefault
    videoGridEl.addEventListener('touchmove', handleTouchMove, { passive: false }); // Need passive: false for preventDefault
    videoGridEl.addEventListener('touchend', handleTouchEnd);
    videoGridEl.addEventListener('touchcancel', handleTouchEnd); // Treat cancel same as end

    // Playlist Drag & Drop Listeners (New)
    playlistListEl.addEventListener('dragstart', handlePlaylistDragStart);
    playlistListEl.addEventListener('dragend', handlePlaylistDragEnd);
    playlistListEl.addEventListener('dragover', handlePlaylistDragOver);
    playlistListEl.addEventListener('dragleave', handlePlaylistDragLeave);
    playlistListEl.addEventListener('drop', handlePlaylistDrop);
}

// --- Drag and Drop ---
function setupDragAndDropListeners() {
    videoGridEl.addEventListener('dragstart', handleDragStart);
    videoGridEl.addEventListener('dragend', handleDragEnd);
    videoGridEl.addEventListener('dragover', handleDragOver);
    videoGridEl.addEventListener('dragleave', handleDragLeave);
    videoGridEl.addEventListener('drop', handleDrop);
}

function handleDragStart(event) {
    const videoCard = event.target.closest('.video-card');
    if (videoCard && videoCard.draggable) {
        draggedVideoId = videoCard.dataset.videoId;
        event.dataTransfer.effectAllowed = 'move';
        // event.dataTransfer.setData('text/plain', draggedVideoId); // Optional data transfer
        setTimeout(() => videoCard.classList.add('dragging'), 0); // Add class after a tick
    }
}

function handleDragEnd(event) {
    // Ensure dragging class is removed
    const draggingElement = videoGridEl.querySelector('.video-card.dragging');
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
    }
    // Ensure highlight styles are cleared definitively
    clearDragOverStyles();
    // Reset state variables
    draggedVideoId = null;
    dragTargetElement = null;
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow drop
    if (!draggedVideoId) return;
    event.dataTransfer.dropEffect = 'move'; // Assume move is possible

    const targetCard = event.target.closest('.video-card');

    // Determine the current valid target card
    let currentTarget = null;
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        currentTarget = targetCard;
    }

    // If the target is different from the currently highlighted one
    if (currentTarget !== dragTargetElement) {
        // Remove highlight from the previous target (if any)
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        // Add highlight to the new target (if any)
        if (currentTarget) {
            currentTarget.classList.add('drag-over');
        }
        // Update the tracked target element
        dragTargetElement = currentTarget;
    }

    // If not over a valid target card, ensure no highlight (handled by the logic above)
    if (!currentTarget) {
         event.dataTransfer.dropEffect = 'none'; // Indicate not droppable here
    }
}

function handleDragLeave(event) {
    // Only clear styles if the mouse leaves the bounds of the entire video grid container.
    // This prevents flicker when moving between cards.
    if (!event.relatedTarget || !videoGridEl.contains(event.relatedTarget)) {
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        dragTargetElement = null;
         // console.log("Left grid boundary"); // Optional debug log
    }
     // Note: dragover handles clearing when moving between cards within the grid.
}

function handleDrop(event) {
    event.preventDefault();
    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    // Clear styles regardless of drop validity
    clearDragOverStyles();

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        // Call the reorder function
        handleReorderVideo(draggedVideoId, dropTargetId);
    } else {
        console.log("Drop occurred on invalid target or self.");
    }

    // Resetting state happens in handleDragEnd, which is called after drop
}

function clearDragOverStyles() {
    // Remove the original drag-over class from any card that might have it
    const highlightedCard = videoGridEl.querySelector('.video-card.drag-over');
    if(highlightedCard) {
        highlightedCard.classList.remove('drag-over');
    }
    // It's also safe to clear from dragTargetElement if it exists
    if (dragTargetElement) {
         dragTargetElement.classList.remove('drag-over');
    }
}

// --- Theme Management ---
function loadTheme() {
    const savedTheme = localStorage.getItem('uiTheme') || 'light';
    applyTheme(savedTheme);
}
function applyTheme(themeName) {
    currentTheme = themeName;
    htmlEl.dataset.theme = themeName;
    updateThemeIcon();
    localStorage.setItem('uiTheme', themeName);
}
function toggleTheme() {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}
function updateThemeIcon() {
    themeToggleBtn.innerHTML = currentTheme === 'dark' ? ICONS.sun : ICONS.moon;
    themeToggleBtn.title = currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
}

// --- Font Management --- // Removed entire section
// function loadFont() { ... }
// function applyFont(fontName) { ... }
// function setFont(fontName) { ... }

// --- YouTube Player API ---
// This function MUST be global for the API to find it
function onYouTubeIframeAPIReady() {
    console.log("YT API Ready. Initializing Player.");
    // Only create player if the element exists
    if (document.getElementById('player')) {
        ytPlayer = new YT.Player('player', {
            height: '100%', 
            width: '100%',
            playerVars: { 
                'playsinline': 1,  // Already set for inline playback
                'rel': 0,          // Disable related videos
                'enablejsapi': 1,  // Ensure JavaScript API is enabled
                'autoplay': 1      // Autoplay (may help with background playback)
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } else {
        // This might happen if the player structure isn't in the DOM initially
        console.warn("Player element ('#player') not found when API was ready.");
    }
}

// No longer needed - initialization happens via onYouTubeIframeAPIReady
// function ensurePlayerInitialized() { ... }

function onPlayerReady(event) {
    console.log("Player Ready");
    isPlayerReady = true;
    // If a video was requested before the player was ready, play it now
    if (videoIdToPlayOnReady) {
        console.log("Playing queued video on ready:", videoIdToPlayOnReady);
        // Call playVideo again - it will now proceed as player is ready
        playVideo(videoIdToPlayOnReady);
        videoIdToPlayOnReady = null; // Clear the queue
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        currentlyPlayingVideoId = getCurrentPlayingVideoIdFromApi();
        updatePlayingVideoHighlight(currentlyPlayingVideoId);

        // Update Media Session metadata when playback starts
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        if (currentPlaylist) {
            const videoData = currentPlaylist.videos.find(v => v.id === currentlyPlayingVideoId);
            if (videoData) {
                updateMediaSessionMetadata(videoData);
            }
        }

        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    }
    if (event.data === YT.PlayerState.PAUSED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
    }
    if (event.data === YT.PlayerState.ENDED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "none";
        }
        playNextVideo();
    }
}

// Added a dedicated error handler
function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    let errorMsg = 'An unknown player error occurred.';
    const videoId = getCurrentPlayingVideoIdFromApi(); // Get ID if possible
    const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'Unknown video';

    console.error(`Error occurred for video: ${videoUrl}`); // Log the URL
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none'; // Update state on error

    let shouldSkip = false; // Flag to determine if we should try skipping

    switch (event.data) {
        case 2: // Invalid parameter
            errorMsg = 'Invalid video ID or player parameter.';
            shouldSkip = true; // Attempt to skip on this error too
            break;
        case 5: // HTML5 player error
            errorMsg = 'Error in the HTML5 player.';
            shouldSkip = true; // Attempt to skip on this error too
            break;
        case 100: // Video not found
            errorMsg = 'Video not found (removed or private).';
            shouldSkip = true;
            break;
        case 101: // Playback not allowed
        case 150: // Playback not allowed
            errorMsg = 'Playback disallowed by video owner. Try watching directly on YouTube.';
            shouldSkip = true;
            break;
        default:
            errorMsg = `Player error code: ${event.data}`;
            shouldSkip = true; // Attempt to skip on unknown errors as well
    }

    // Show toast regardless of whether we skip or not (unless handled specially below)
    showToast(`Player Error: ${errorMsg}`, 'error');

    // Attempt to skip to the next video if autoplay is enabled and skipping is flagged
    if (isAutoplayEnabled && shouldSkip) {
        showToast(`${errorMsg} Skipping to next video.`, 'info', 4000); // Show a follow-up toast
        // Use a small delay to allow the error toast to show first,
        // and prevent potential race conditions if errors happen rapidly.
        setTimeout(playNextVideo, 500);
    } else {
        // Optional: If not autoplaying or not skipping, maybe hide player?
        // stopVideo();
        // playerWrapperEl.classList.add('hidden');
    }
}

function getCurrentPlayingVideoIdFromApi() {
    if (ytPlayer && typeof ytPlayer.getVideoData === 'function') {
        const videoData = ytPlayer.getVideoData();
        return videoData ? videoData.video_id : null;
    }
    return null;
}

function playNextVideo() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) return; // Check if playlist is empty

    // If there's no currently playing video ID tracked, or only one video, don't proceed
    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        // Maybe play the first video if nothing was playing? Or just return?
        // For now, let's assume playNext is only called after a video ends/errors.
        console.log("playNextVideo called but no video was playing. Starting from first video.");
        playVideo(currentPlaylist.videos[0].id); // Try playing the first video as a fallback
        return;
    }
    if (!currentlyPlayingVideoId || currentPlaylist.videos.length < 2) return; // Need at least 2 videos to advance

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) {
        // If the currently tracked video isn't found (e.g., deleted?), play the first one
        console.warn("Currently playing video not found in playlist during playNext. Playing first video.");
        if (currentPlaylist.videos.length > 0) {
            playVideo(currentPlaylist.videos[0].id);
        }
        return;
    }

    const nextIndex = (currentIndex + 1) % currentPlaylist.videos.length;
    const nextVideo = currentPlaylist.videos[nextIndex];
    if (nextVideo) {
        console.log(`Autoplaying next video: ${nextVideo.title} (Index: ${nextIndex})`);
        playVideo(nextVideo.id);
    } else {
        console.error(`Could not find next video at index ${nextIndex}`);
        // Maybe stop playback or try the first video again?
        stopVideo();
        playerWrapperEl.classList.add('hidden');
    }
}

// --- Local Storage & State ---
function savePlaylists() { localStorage.setItem('playlists', JSON.stringify(playlists)); }
function loadPlaylists() {
    playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    // Ensure structure consistency (add videos array if missing)
    playlists.forEach(p => { if (!p.videos) p.videos = []; });
}
function saveLastSelectedPlaylist(id) { localStorage.setItem('lastSelectedPlaylistId', id ? String(id) : ''); }
function saveAutoplaySetting() { localStorage.setItem('autoplayEnabled', isAutoplayEnabled); }
function loadAutoplaySetting() {
    isAutoplayEnabled = localStorage.getItem('autoplayEnabled') === 'true';
    autoplayToggle.checked = isAutoplayEnabled;
}

// Added functions for audio-only state
function saveAudioOnlySetting() { localStorage.setItem('audioOnlyEnabled', isAudioOnlyMode); }
function loadAudioOnlySetting() {
    isAudioOnlyMode = localStorage.getItem('audioOnlyEnabled') === 'true';
    audioOnlyToggle.checked = isAudioOnlyMode;
    // Apply the class initially if needed
    applyAudioOnlyClass();
}

// Function to apply/remove the class based on state
function applyAudioOnlyClass() {
    if (isAudioOnlyMode) {
        bodyEl.classList.add('audio-only-active');
    } else {
        bodyEl.classList.remove('audio-only-active');
    }
}

// --- Playlist Management ---
function handleCreatePlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) { showToast('Please enter a playlist name.', 'error'); playlistNameInput.focus(); return; }
    const newPlaylist = { id: Date.now(), name: name, videos: [] };
    playlists.unshift(newPlaylist); // Add to top for visibility
    savePlaylists();
    playlistSearchInput.value = ''; // Clear search on create
    renderPlaylists();
    selectPlaylist(newPlaylist.id);
    playlistNameInput.value = '';
    showToast(`Playlist "${escapeHTML(name)}" created.`, 'success');
}

function handleDeletePlaylist(id) {
    const playlistIndex = playlists.findIndex(p => p.id === id);
    if (playlistIndex === -1) return;
    const playlistName = playlists[playlistIndex].name;

    if (!confirm(`Are you sure you want to delete the playlist "${escapeHTML(playlistName)}"? This cannot be undone.`)) return;

    playlists.splice(playlistIndex, 1);

    if (currentPlaylistId === id) {
        currentPlaylistId = null;
        saveLastSelectedPlaylist(null);
        if (playlists.length > 0) {
            // Try selecting the next or previous playlist, otherwise the first
            const nextIndex = Math.min(playlistIndex, playlists.length - 1);
            selectPlaylist(playlists[nextIndex >= 0 ? nextIndex : 0]?.id);
        } else {
            updateUIForNoSelection();
        }
    }
    savePlaylists();
    renderPlaylists(); // Re-render filtered list if needed
    showToast(`Playlist "${escapeHTML(playlistName)}" deleted.`, 'info');
}

function handleRenamePlaylist(id) {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return;
    const newName = prompt('Enter new name for playlist:', playlist.name);
    if (newName && newName.trim() && newName.trim() !== playlist.name) {
        const oldName = playlist.name;
        playlist.name = newName.trim();
        savePlaylists();
        renderPlaylists(); // Re-render filtered list if needed
        if (currentPlaylistId === id) {
            currentPlaylistTitleEl.textContent = escapeHTML(playlist.name);
        }
        showToast(`Playlist renamed from "${escapeHTML(oldName)}" to "${escapeHTML(playlist.name)}".`, 'info');
    }
}

function selectPlaylist(id) {
    const selectedPlaylist = playlists.find(p => p.id === id);
    if (!selectedPlaylist) {
        console.error("Playlist not found:", id);
        updateUIForNoSelection();
        return;
    }

    currentPlaylistId = id;
    currentPage = 1; // Reset to first page when selecting a playlist
    saveLastSelectedPlaylist(id);

    // --- UX Improvement: Clear search when selecting a playlist ---
    if (playlistSearchInput.value !== '') {
        playlistSearchInput.value = '';
        // Re-rendering playlists will happen below anyway
    }
    // --- End UX Improvement ---

    // Update UI
    currentPlaylistTitleEl.textContent = escapeHTML(selectedPlaylist.name);
    videoFormEl.classList.remove('hidden');
    playlistActionsEl.classList.remove('hidden');
    addVideoBtn.disabled = videoUrlInput.value.trim() === ''; // Set initial state based on input
    videoPlaceholderEl.classList.add('hidden');
    playerWrapperEl.classList.add('hidden');
    stopVideo(); // This will also clear the highlight
    updatePlayingVideoHighlight(null); // Explicitly clear highlight

    renderPlaylists(); // Update active state
    renderVideos(); // Render videos for the selected playlist
}

function handleClearPlaylist() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        showToast('Playlist is already empty.', 'info');
        return;
    }
    if (!confirm(`Are you sure you want to remove all videos from "${escapeHTML(currentPlaylist.name)}"?`)) return;

    currentPlaylist.videos = [];
    savePlaylists();
    stopVideo();
    playerWrapperEl.classList.add('hidden');
    renderVideos(); // Re-render the empty grid/placeholder
    renderPlaylists(); // Update video count in sidebar
    showToast(`All videos removed from "${escapeHTML(currentPlaylist.name)}".`, 'info');
}

function handlePlaylistSearch() {
    renderPlaylists(); // Re-render with the current search term
}

// --- Playlist Shuffle Functionality (Added) ---
function handleShufflePlaylist() {
    if (!currentPlaylistId) {
        showToast('Please select a playlist to shuffle.', 'info');
        return;
    }
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 2) {
        showToast('Playlist needs at least two videos to shuffle.', 'info');
        return;
    }

    // Fisher-Yates (Knuth) Shuffle Algorithm
    let currentIndex = currentPlaylist.videos.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [currentPlaylist.videos[currentIndex], currentPlaylist.videos[randomIndex]] = [
            currentPlaylist.videos[randomIndex], currentPlaylist.videos[currentIndex]];
    }

    savePlaylists();
    currentPage = 1; // Reset to first page after shuffle
    renderVideos(); // Re-render the video grid with the shuffled order
    showToast(`Playlist "${escapeHTML(currentPlaylist.name)}" shuffled!`, 'success');
}
// --- End Playlist Shuffle Functionality ---

// --- Video Management ---

// Helper function to update the visual highlight on the playing video card
function updatePlayingVideoHighlight(videoId) {
    // Remove 'playing' class from all video cards first
    videoGridEl.querySelectorAll('.video-card.playing').forEach(card => {
        card.classList.remove('playing');
    });

    // Add 'playing' class to the current video card if an ID is provided
    if (videoId) {
        const currentVideoCard = videoGridEl.querySelector(`.video-card[data-video-id="${videoId}"]`);
        if (currentVideoCard) {
            currentVideoCard.classList.add('playing');
        }
    }
}

async function handleAddVideo() {
    const url = videoUrlInput.value.trim();
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!url) { showToast('Please enter a YouTube video URL.', 'error'); return; }
    if (!currentPlaylist) return; // Should not happen if form is visible

    const videoId = extractVideoId(url);
    if (!videoId) { showToast('Invalid YouTube URL. Please paste a valid video link.', 'error'); videoUrlInput.focus(); return; }
    if (currentPlaylist.videos.some(v => v.id === videoId)) { showToast(`Video is already in "${escapeHTML(currentPlaylist.name)}".`, 'info'); return; }

    // UI Feedback: Loading state
    addVideoBtn.disabled = true;
    addVideoBtn.innerHTML = ICONS.loading + ' Adding...';
    videoUrlInput.disabled = true;

    try {
        // Use noembed.com - Add error handling!
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (!response.ok) {
            // Try to get error message, fallback to status text
            let errorMsg = `Failed to fetch video info (HTTP ${response.status}).`;
            try { const errData = await response.json(); errorMsg = errData.error || errorMsg; } catch (_) { }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (data.error) { throw new Error(data.error); } // Handle errors reported by noembed

        const video = {
            id: videoId,
            title: data.title || 'Untitled Video',
            thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, // Fallback thumbnail
            url: `https://youtu.be/${videoId}`
        };

        currentPlaylist.videos.push(video);
        currentPage = Math.ceil(currentPlaylist.videos.length / videosPerPage); // Go to the last page where the new video is
        savePlaylists();
        renderVideos();
        renderPlaylists(); // Update count in sidebar
        videoUrlInput.value = ''; // Clear input on success
        showToast(`Video "${escapeHTML(video.title)}" added.`, 'success');

    } catch (error) {
        console.error('Add video error:', error);
        showToast(`Error adding video: ${error.message}`, 'error');
    } finally {
        // Restore button state
        addVideoBtn.disabled = false; // Re-enable, state depends on input now
        addVideoBtn.innerHTML = ICONS.add + ' Add Video';
        videoUrlInput.disabled = false;
        videoUrlInput.focus(); // Focus back for next add
    }
}

function handleDeleteVideo(videoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoIndex = currentPlaylist.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;

    const videoTitle = currentPlaylist.videos[videoIndex].title;
    // No confirmation needed for removing a single video, maybe add later if desired
    // if (!confirm(`Remove "${escapeHTML(videoTitle)}" from this playlist?`)) return;

    // Stop if playing this video
    if (videoId === currentlyPlayingVideoId) {
        stopVideo();
        playerWrapperEl.classList.add('hidden');
        handleClosePlayer(); // Also ensure player is hidden if its video is deleted
    }

    currentPlaylist.videos.splice(videoIndex, 1);

    // Adjust current page if necessary (e.g., deleting the last item on a page)
    const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (currentPlaylist.videos.length === 0) {
        currentPage = 1; // Reset if playlist becomes empty
    }

    savePlaylists();
    renderVideos();
    renderPlaylists(); // Update count in sidebar
    showToast(`Removed "${escapeHTML(videoTitle)}".`, 'info');
}

// Modified to accept dropEffect ('before' or 'after')
function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [videoToMove] = currentPlaylist.videos.splice(videoToMoveIndex, 1); // Remove the video

    // Find the target's NEW index after the splice
    const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);

    if (targetIndex !== -1) {
        // Original behavior: Always insert *before* the target video's new position
        currentPlaylist.videos.splice(targetIndex, 0, videoToMove);
    } else {
        // Target not found, append to end as fallback
        console.warn("Reorder target not found after splice, appending video to end.");
        currentPlaylist.videos.push(videoToMove);
    }

    savePlaylists();
    renderVideos(); // Re-render the grid with the new order
}

function playVideo(videoId) {
    // Ensure the player container is visible first
    // UNLESS we are in audio-only mode
    if (!isAudioOnlyMode) {
        playerWrapperEl.classList.remove('hidden');
    } else {
        // If audio-only is active, ensure the wrapper *is* shown
        // (because the CSS will hide the inner container)
        // but don't scroll to it.
         playerWrapperEl.classList.remove('hidden');
    }

    currentlyPlayingVideoId = videoId; // Set this immediately for state tracking
    updatePlayingVideoHighlight(videoId); // Highlight the selected video immediately
    applyAudioOnlyClass(); // Ensure correct class is applied

    // Check if player is initialized AND ready
    if (ytPlayer && isPlayerReady) {
        console.log("Player exists and is ready. Loading and playing video:", videoId);
        try {
            // Use loadVideoById to load the video
            ytPlayer.loadVideoById(videoId);
            // Explicitly call playVideo() right after loading.
            // This might reinforce the user-initiated playback signal on some browsers.
            ytPlayer.playVideo();

            // Scroll player into view smoothly, but only if not in audio-only mode
            if (!isAudioOnlyMode) {
                setTimeout(() => {
                    if (playerWrapperEl.offsetParent !== null) { // Check if element is visible before scrolling
                        playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 100);
            }
        } catch (error) {
            console.error("Error calling loadVideoById or playVideo:", error);
            showToast("Failed to load or play video in player.", "error");
            handleClosePlayer(); // Reset state if loading fails
            videoIdToPlayOnReady = null; // Clear any queue if loading failed
        }
    } else {
        // Player not ready or not initialized yet, queue the video ID
        console.log(`Player not ready (Player: ${!!ytPlayer}, Ready: ${isPlayerReady}). Queuing video:`, videoId);
        videoIdToPlayOnReady = videoId;
        // The onPlayerReady handler will call playVideo(videoIdToPlayOnReady) again,
        // and the playVideo logic above will then execute, including the playVideo() call.
    }

    // --- Media Session Update ---
    // Metadata is already set here. Playback state will be updated in onPlayerStateChange.
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (currentPlaylist) {
        const videoData = currentPlaylist.videos.find(v => v.id === videoId);
        if (videoData) {
            updateMediaSessionMetadata(videoData);
        } else {
             updateMediaSessionMetadata(null); // Clear if video data not found
        }
    } else {
        updateMediaSessionMetadata(null); // Clear if playlist not found
    }
    // --- End Media Session Update ---
}

function stopVideo() {
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        ytPlayer.stopVideo();
    }
    currentlyPlayingVideoId = null;
    updatePlayingVideoHighlight(null); // Remove highlight when stopped
    if ('mediaSession' in navigator) { // Clear media session on stop
        navigator.mediaSession.playbackState = 'none';
        // Don't clear metadata here, handleClosePlayer might do it
        // updateMediaSessionMetadata(null);
    }
    // Don't hide player wrapper here, handleClosePlayer does that
}

function extractVideoId(url) {
    // Regex covers various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// --- Rendering ---
function renderPlaylists() {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    const filteredPlaylists = playlists.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (filteredPlaylists.length === 0) {
        playlistListEl.innerHTML = '';
        noPlaylistsMessageEl.classList.remove('hidden');
        noPlaylistsMessageEl.textContent = searchTerm ? 'No playlists match your search.' : 'No playlists created yet.';
    } else {
        noPlaylistsMessageEl.classList.add('hidden');
        playlistListEl.innerHTML = ''; // Clear existing content first
        const fragment = document.createDocumentFragment(); // Create a fragment
        filteredPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = `playlist-item ${playlist.id === currentPlaylistId ? 'active' : ''}`;
            li.dataset.id = playlist.id;
            li.draggable = true; // Make the playlist item draggable
            li.innerHTML = `
                        <span class="playlist-name">${escapeHTML(playlist.name)}</span>
                        <span class="playlist-count">${playlist.videos.length}</span>
                        <div class="controls">
                            <button class="icon-button rename-btn" title="Rename Playlist">
                                ${ICONS.rename}
                                <span class="visually-hidden">Rename ${escapeHTML(playlist.name)}</span>
                            </button>
                            <button class="icon-button delete-btn" title="Delete Playlist">
                                ${ICONS.delete}
                                <span class="visually-hidden">Delete ${escapeHTML(playlist.name)}</span>
                            </button>
                        </div>
                    `;
            fragment.appendChild(li); // Add the item to the fragment
        });
        playlistListEl.appendChild(fragment); // Append the fragment to the DOM once
    }
}

function renderVideos() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);

    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        videoGridEl.innerHTML = ''; // Clear grid
        paginationControlsEl.classList.add('hidden'); // Hide pagination if no videos
        videoPlaceholderEl.textContent = currentPlaylist ? `Playlist "${escapeHTML(currentPlaylist.name)}" is empty. Add some videos!` : 'Select or create a playlist.';
        videoPlaceholderEl.classList.remove('hidden');
        return;
    }

    // --- Pagination Logic ---
    const totalVideos = currentPlaylist.videos.length;
    const totalPages = Math.ceil(totalVideos / videosPerPage);

    // Ensure currentPage is valid (e.g., after deletion)
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1; // Should be handled by the empty check above, but safety first
    }

    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const videosToRender = currentPlaylist.videos.slice(startIndex, endIndex);
    // --- End Pagination Logic ---

    videoPlaceholderEl.classList.add('hidden'); // Hide placeholder
    videoGridEl.innerHTML = ''; // Clear existing grid content
    const fragment = document.createDocumentFragment(); // Create a fragment

    videosToRender.forEach(video => { // Iterate over the page's videos only
        const div = document.createElement('div');
        div.className = 'video-card';
        div.dataset.videoId = video.id;
        div.draggable = true;
        div.innerHTML = `
                    <div class="video-card" data-video-id="${video.id}" draggable="true">
                        <div class="thumbnail-wrapper">
                           <img src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy"> <!-- Alt can be empty as title is below -->
                        </div>
                        <div class="video-info">
                             <h4>${escapeHTML(video.title)}</h4>
                             <div class="video-controls">
                                 <span class="drag-handle" title="Drag to reorder">
                                    ${ICONS.drag}
                                    <span class="visually-hidden">Drag to reorder ${escapeHTML(video.title)}</span>
                                 </span>
                                 <button class="icon-button delete-video-btn" title="Remove from playlist">
                                    ${ICONS.delete}
                                    <span class="visually-hidden">Remove ${escapeHTML(video.title)} from playlist</span>
                                 </button>
                             </div>
                        </div>
                    </div>
                `;
        fragment.appendChild(div.firstElementChild); // Append the actual card element from the innerHTML
    });

    videoGridEl.appendChild(fragment); // Append the fragment to the DOM once

    // Render pagination controls after rendering videos
    renderPaginationControls(totalVideos, totalPages);
}

// --- UI Updates ---
function updateUIForNoSelection() {
    currentPlaylistId = null;
    saveLastSelectedPlaylist(null);

    currentPlaylistTitleEl.textContent = 'No playlist selected';
    videoFormEl.classList.add('hidden');
    playlistActionsEl.classList.add('hidden');
    addVideoBtn.disabled = true;
    videoGridEl.innerHTML = '';
    playerWrapperEl.classList.add('hidden');
    stopVideo();
    videoPlaceholderEl.textContent = 'Create or select a playlist to get started.';
    videoPlaceholderEl.classList.remove('hidden');

    renderPlaylists(); // Ensure playlist list is updated (e.g., no active item)
}

function handleAutoplayToggle() {
    isAutoplayEnabled = autoplayToggle.checked;
    saveAutoplaySetting();
    showToast(`Autoplay ${isAutoplayEnabled ? 'enabled' : 'disabled'}.`, 'info');
}

// Added handler for the new toggle
function handleAudioOnlyToggle() {
    isAudioOnlyMode = audioOnlyToggle.checked;
    saveAudioOnlySetting();
    applyAudioOnlyClass(); // Apply/remove the class immediately
    showToast(`Audio-Only Mode ${isAudioOnlyMode ? 'enabled' : 'disabled'}.`, 'info');

    // If a video is currently playing, adjust visibility/scrolling
    if (currentlyPlayingVideoId) {
        if (isAudioOnlyMode) {
            // No need to scroll, CSS handles hiding the video
             playerWrapperEl.classList.remove('hidden'); // Ensure wrapper is visible
        } else {
            // Show video and scroll into view if it was hidden
            playerWrapperEl.classList.remove('hidden');
            setTimeout(() => {
                 if (playerWrapperEl.offsetParent !== null) {
                    playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                 }
            }, 100);
        }
    } else {
         // If no video playing, ensure player wrapper is hidden if audio-only is disabled
         // and no video is selected to play next
         if (!isAudioOnlyMode && !videoIdToPlayOnReady) {
            playerWrapperEl.classList.add('hidden');
         }
    }
}

// --- Import / Export ---
function handleExportPlaylists() {
    if (playlists.length === 0) {
        showToast('No playlists to export.', 'info');
        return;
    }
    try {
        const dataStr = JSON.stringify(playlists, null, 2); // Pretty print JSON
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `playlists_backup_${new Date().toISOString().split('T')[0]}.json`; // YYYY-MM-DD
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Playlists exported successfully!', 'success');
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
            // Basic validation: Is it an array? Does it look like playlists?
            if (!Array.isArray(importedData) || (importedData.length > 0 && typeof importedData[0].id === 'undefined')) {
                throw new Error("Invalid file format. Expected an array of playlists.");
            }

            // Merge or replace? Ask user? For simplicity, let's merge and avoid duplicates by ID.
            const existingIds = new Set(playlists.map(p => p.id));
            let addedCount = 0;
            let skippedCount = 0;

            importedData.forEach(importedPlaylist => {
                // Basic validation of playlist structure
                if (importedPlaylist && typeof importedPlaylist.id !== 'undefined' && typeof importedPlaylist.name === 'string') {
                    // Ensure videos array exists and has basic structure
                    if (!Array.isArray(importedPlaylist.videos)) importedPlaylist.videos = [];
                    importedPlaylist.videos = importedPlaylist.videos.filter(v => v && typeof v.id === 'string' && typeof v.title === 'string');

                    if (!existingIds.has(importedPlaylist.id)) {
                        playlists.push(importedPlaylist);
                        existingIds.add(importedPlaylist.id);
                        addedCount++;
                    } else {
                        skippedCount++;
                        // Optionally implement merging logic here (e.g., update existing)
                    }
                } else {
                    skippedCount++; // Skip malformed playlist entries
                }
            });

            savePlaylists();
            playlistSearchInput.value = ''; // Clear search after import
            renderPlaylists();
            showToast(`Imported ${addedCount} playlists. Skipped ${skippedCount} duplicates or invalid entries.`, 'success');
            // Select the first imported playlist if none was selected before
            if (!currentPlaylistId && playlists.length > 0) {
                selectPlaylist(playlists[0].id);
            }

        } catch (error) {
            console.error("Import error:", error);
            showToast(`Import failed: ${error.message}`, 'error');
        } finally {
            // Reset file input value to allow importing the same file again
            importFileEl.value = '';
        }
    };
    reader.onerror = () => {
        showToast('Error reading file.', 'error');
        importFileEl.value = '';
    };
    reader.readAsText(file);
}

function handleVisualSwitchClick(event) {
    // Find the parent switch element that was clicked
    const switchElement = event.target.closest('.switch');
    if (!switchElement) return; // Exit if click wasn't within a switch

    // Find the actual checkbox input within this specific switch
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    if (!checkbox) return; // Exit if no checkbox found

    // We only want to react if the click wasn't directly on the hidden input itself.
    // This ensures clicking the visual parts (slider/background) triggers the toggle.
    if (event.target !== checkbox) {
        // Programmatically click the associated hidden checkbox.
        // This will toggle its 'checked' state AND trigger the 'change' event listener
        // (e.g., handleAutoplayToggle or handleAudioOnlyToggle).
        checkbox.click();
    }
}

// --- Utility ---
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

let toastTimeout = null;
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // type can be 'info', 'success', 'error'

    let icon = ICONS.info;
    if (type === 'success') icon = ICONS.success;
    if (type === 'error') icon = ICONS.error;

    toast.innerHTML = `
                ${icon}
                <span>${escapeHTML(message)}</span>
            `;
    toastContainerEl.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10); // Small delay for transition

    // Auto-dismiss
    const timeoutId = setTimeout(() => {
        toast.classList.remove('show');
        // Remove from DOM after transition
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);

    // Allow manual dismiss
    toast.addEventListener('click', () => {
        clearTimeout(timeoutId);
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    });
}

function handleClosePlayer() {
    stopVideo(); // stopVideo now handles removing the highlight
    playerWrapperEl.classList.add('hidden');
    bodyEl.classList.remove('audio-only-active'); // Ensure class is removed on close
    if ('mediaSession' in navigator) { // Clear media session on explicit close
        updateMediaSessionMetadata(null);
    }
}

function renderPaginationControls(totalVideos, totalPages) {
    // const currentPlaylist = playlists.find(p => p.id === currentPlaylistId); // Data already available
    // if (!currentPlaylist || currentPlaylist.videos.length <= videosPerPage) {
    if (totalVideos <= videosPerPage) { // Simpler check based on passed data
        // Hide controls if not needed (single page or empty)
        paginationControlsEl.classList.add('hidden');
        return;
    }

    paginationControlsEl.classList.remove('hidden'); // Show controls
    // const totalVideos = currentPlaylist.videos.length; // Passed as argument
    // const totalPages = Math.ceil(totalVideos / videosPerPage); // Passed as argument

    pageInfoEl.textContent = `Page ${currentPage} of ${totalPages}`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// --- Utility ---

// Debounce function: prevents function from running too often
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

// --- Media Session API Integration ---

function updateMediaSessionMetadata(video) {
    if (!('mediaSession' in navigator)) {
        // console.log("Media Session API not supported.");
        return;
    }

    if (!video) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
        // console.log("Media Session metadata cleared.");
        return;
    }

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    const playlistName = currentPlaylist ? currentPlaylist.name : 'Playlist';

    // console.log("Updating Media Session Metadata for:", video.title);

    navigator.mediaSession.metadata = new MediaMetadata({
        title: video.title,
        artist: 'YouTube', // Replace with channel name if available
        album: playlistName,
        artwork: [
            { src: video.thumbnail.replace('mqdefault', 'hqdefault'), sizes: '480x360', type: 'image/jpeg' },
            { src: video.thumbnail, sizes: '320x180', type: 'image/jpeg' },
        ]
    });

    // Update playback state (usually done in onPlayerStateChange)
    // navigator.mediaSession.playbackState = "playing"; // Set this when playback actually starts

    setupMediaSessionActionHandlers(); // Ensure handlers are set up
}

function setupMediaSessionActionHandlers() {
     if (!('mediaSession' in navigator)) return;

    // Clear previous handlers to avoid duplicates if called multiple times
    navigator.mediaSession.setActionHandler('play', null);
    navigator.mediaSession.setActionHandler('pause', null);
    navigator.mediaSession.setActionHandler('stop', null);
    navigator.mediaSession.setActionHandler('previoustrack', null);
    navigator.mediaSession.setActionHandler('nexttrack', null);

    // console.log("Setting up Media Session Action Handlers");

    navigator.mediaSession.setActionHandler('play', () => {
        // console.log("Media Session: Play");
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.playVideo();
             navigator.mediaSession.playbackState = "playing";
        }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        // console.log("Media Session: Pause");
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
            ytPlayer.pauseVideo();
             navigator.mediaSession.playbackState = "paused";
        }
    });

    navigator.mediaSession.setActionHandler('stop', () => {
        // console.log("Media Session: Stop");
        handleClosePlayer(); // Use the existing close/stop function
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        // console.log("Media Session: Previous Track");
        playPreviousVideo();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        // console.log("Media Session: Next Track");
        playNextVideo();
    });
}

function playPreviousVideo() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1 || !currentlyPlayingVideoId) return;

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) return; // Current video not found

    // Calculate previous index, wrapping around to the end
    const prevIndex = (currentIndex - 1 + currentPlaylist.videos.length) % currentPlaylist.videos.length;
    const prevVideo = currentPlaylist.videos[prevIndex];

    if (prevVideo) {
        playVideo(prevVideo.id);
    }
}

// --- Touch Drag and Drop Handlers ---

function handleTouchStart(event) {
    const targetCard = event.target.closest('.video-card[draggable="true"]');
    const dragHandle = event.target.closest('.drag-handle');

    // Only start drag if touching the drag handle
    if (targetCard && dragHandle) {
        isTouchDragging = true;
        draggedVideoId = targetCard.dataset.videoId;
        touchDraggedElement = targetCard;
        touchDragStartY = event.touches[0].clientY; // Store initial Y pos

        // event.preventDefault(); // Prevent scrolling while initiating drag (can be disruptive)

        // Add dragging style immediately (no delay needed like mouse drag)
        touchDraggedElement.classList.add('dragging');

        // Optional: Provide haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrate for 50ms
        }
    } else {
        isTouchDragging = false; // Ensure state is reset if not dragging
        draggedVideoId = null;
        touchDraggedElement = null;
    }
}

function handleTouchMove(event) {
    if (!isTouchDragging || !touchDraggedElement) return;

    event.preventDefault();

    const touch = event.touches[0];

    touchDraggedElement.style.visibility = 'hidden';
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDraggedElement.style.visibility = '';

    const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card') : null;

    // Determine the current valid target card for touch
    let currentTouchTarget = null;
    if (targetCard && targetCard !== touchDraggedElement) {
        currentTouchTarget = targetCard;
    }

    // If the target is different from the currently highlighted one
    if (currentTouchTarget !== dragTargetElement) {
        // Remove highlight from the previous target (if any)
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        // Add highlight to the new target (if any)
        if (currentTouchTarget) {
            currentTouchTarget.classList.add('drag-over');
        }
        // Update the tracked target element
        dragTargetElement = currentTouchTarget;
    }
}

function handleTouchEnd(event) {
    if (!isTouchDragging || !touchDraggedElement) {
         clearDragOverStyles();
         if (touchDraggedElement) touchDraggedElement.classList.remove('dragging');
         isTouchDragging = false;
         draggedVideoId = null;
         touchDraggedElement = null;
         dragTargetElement = null;
        return;
    }

    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    // Reset visual styles first
    touchDraggedElement.classList.remove('dragging');
    clearDragOverStyles(); // Clear highlight

    // Perform the drop action
    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
        if (navigator.vibrate) {
             navigator.vibrate([50, 50, 50]);
        }
    }

    // Reset state variables
    isTouchDragging = false;
    draggedVideoId = null;
    touchDraggedElement = null;
    dragTargetElement = null;
}

// --- Drag and Drop (Playlists) ---
let draggedPlaylistId = null;
let dragTargetPlaylistElement = null;

function handlePlaylistDragStart(event) {
    const playlistItem = event.target.closest('.playlist-item');
    if (playlistItem && playlistItem.draggable) {
        // Prevent dragging if clicking on controls inside the item
        if (event.target.closest('.controls')) {
            event.preventDefault();
            return;
        }
        draggedPlaylistId = parseInt(playlistItem.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        // event.dataTransfer.setData('text/plain', draggedPlaylistId); // Optional
        setTimeout(() => playlistItem.classList.add('dragging'), 0);
        dragTargetPlaylistElement = null; // Reset target
    }
}

function handlePlaylistDragEnd(event) {
    const playlistItem = event.target.closest('.playlist-item.dragging');
    if (playlistItem) {
        playlistItem.classList.remove('dragging');
    }
    clearPlaylistDragOverStyles();
    draggedPlaylistId = null;
    dragTargetPlaylistElement = null;
}

function handlePlaylistDragOver(event) {
    event.preventDefault(); // Allow drop
    if (!draggedPlaylistId) return;
    event.dataTransfer.dropEffect = 'move';

    const targetItem = event.target.closest('.playlist-item');
    let currentTarget = null;

    if (targetItem && targetItem.draggable && parseInt(targetItem.dataset.id) !== draggedPlaylistId) {
         currentTarget = targetItem;
    }

    if (currentTarget !== dragTargetPlaylistElement) {
        clearPlaylistDragOverStyles(); // Clear previous target
        if (currentTarget) {
            currentTarget.classList.add('drag-over'); // Highlight new target
        }
        dragTargetPlaylistElement = currentTarget; // Track new target
    }

     if (!currentTarget) {
         event.dataTransfer.dropEffect = 'none'; // Cannot drop here
     }
}

function handlePlaylistDragLeave(event) {
    // Clear styles only if leaving the list container bounds
    if (!event.relatedTarget || !playlistListEl.contains(event.relatedTarget)) {
        clearPlaylistDragOverStyles();
        dragTargetPlaylistElement = null;
    }
}

function handlePlaylistDrop(event) {
    event.preventDefault();
    const dropTargetId = dragTargetPlaylistElement ? parseInt(dragTargetPlaylistElement.dataset.id) : null;

    clearPlaylistDragOverStyles(); // Always clear styles

    if (draggedPlaylistId && dropTargetId && dropTargetId !== draggedPlaylistId) {
        handleReorderPlaylist(draggedPlaylistId, dropTargetId);
    }

    // Resetting state happens in handlePlaylistDragEnd
}

function clearPlaylistDragOverStyles() {
    const highlightedItem = playlistListEl.querySelector('.playlist-item.drag-over');
    if (highlightedItem) {
        highlightedItem.classList.remove('drag-over');
    }
     if (dragTargetPlaylistElement) {
         dragTargetPlaylistElement.classList.remove('drag-over');
     }
}

function handleReorderPlaylist(playlistIdToMove, targetPlaylistId) {
    const playlistToMoveIndex = playlists.findIndex(p => p.id === playlistIdToMove);
    if (playlistToMoveIndex === -1) return;

    const [playlistToMove] = playlists.splice(playlistToMoveIndex, 1); // Remove the playlist

    // Find the target's NEW index after the splice
    const targetIndex = playlists.findIndex(p => p.id === targetPlaylistId);

    if (targetIndex !== -1) {
        // Insert before the target's new position
        playlists.splice(targetIndex, 0, playlistToMove);
    } else {
        // Fallback: append to end if target not found (shouldn't happen in valid drop)
        console.warn("Playlist reorder target not found after splice, appending to end.");
        playlists.push(playlistToMove);
    }

    savePlaylists();
    renderPlaylists(); // Re-render the list with the new order
    showToast('Playlist order updated.', 'info', 1500); // Short confirmation
}

// --- Start the app ---
init();