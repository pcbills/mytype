// ===== STATE =====
let currentProfile = null;
let currentCategory = null;
let currentEntry = null;
let gameState = 'idle'; // idle | waiting | playing | finished
let typingPosition = 0;
let errors = 0;
let totalKeystrokes = 0;
let startTime = null;
let charSpans = [];
let liveStatsInterval = null;

// ===== DOM REFS =====
const $ = (id) => document.getElementById(id);
const screens = {
  home: $('home-screen'),
  category: $('category-screen'),
  game: $('game-screen'),
};

// ===== STORAGE =====
const PROFILES_KEY = 'mytype_profiles';
const CUSTOM_ENTRIES_KEY = 'mytype_custom_entries';

function loadProfiles() {
  return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function loadCustomEntries() {
  return JSON.parse(localStorage.getItem(CUSTOM_ENTRIES_KEY) || '[]');
}

function saveCustomEntries(entries) {
  localStorage.setItem(CUSTOM_ENTRIES_KEY, JSON.stringify(entries));
}

// ===== DATA HELPERS =====
function getAllEntries() {
  return [...DEFAULT_ENTRIES, ...loadCustomEntries()];
}

function getAllCategories() {
  const entries = getAllEntries();
  const categoryMap = {};

  DEFAULT_CATEGORIES.forEach(c => {
    categoryMap[c.id] = { ...c, entryCount: 0 };
  });

  // Check custom entries for new categories
  const customEntries = loadCustomEntries();
  customEntries.forEach(e => {
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = {
        id: e.category,
        name: e.categoryName || e.category,
        icon: '\ud83d\udcdd',
        entryCount: 0,
      };
    }
  });

  // Count entries per category
  entries.forEach(e => {
    if (categoryMap[e.category]) {
      categoryMap[e.category].entryCount++;
    }
  });

  return Object.values(categoryMap).filter(c => c.entryCount > 0);
}

function getEntriesForCategory(categoryId) {
  return getAllEntries().filter(e => e.category === categoryId);
}

function getProfileStats(profileName) {
  const profiles = loadProfiles();
  const profile = profiles[profileName];
  if (!profile || !profile.entryStats) {
    return { avgWpm: 0, avgAccuracy: 0, totalWords: 0, entriesPlayed: 0 };
  }

  const stats = Object.values(profile.entryStats);
  if (stats.length === 0) {
    return { avgWpm: 0, avgAccuracy: 0, totalWords: 0, entriesPlayed: 0 };
  }

  const totalWpm = stats.reduce((sum, s) => sum + s.wpm, 0);
  const totalAcc = stats.reduce((sum, s) => sum + s.accuracy, 0);
  const totalWords = stats.reduce((sum, s) => sum + s.words, 0);

  return {
    avgWpm: Math.round(totalWpm / stats.length),
    avgAccuracy: Math.round(totalAcc / stats.length),
    totalWords,
    entriesPlayed: stats.length,
  };
}

function getCompletedEntries(profileName, categoryId) {
  const profiles = loadProfiles();
  const profile = profiles[profileName];
  if (!profile || !profile.completedEntries) return [];
  return profile.completedEntries[categoryId] || [];
}

// ===== SCREEN NAVIGATION =====
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');

  if (name === 'home') renderHomeScreen();
  if (name === 'category') renderCategoryScreen();
}

// ===== HOME SCREEN =====
function renderHomeScreen() {
  const profiles = loadProfiles();
  const list = $('profiles-list');
  list.innerHTML = '';

  const names = Object.keys(profiles);
  names.forEach((name, i) => {
    const stats = getProfileStats(name);
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.onclick = () => selectProfile(name);

    const avatarColor = `avatar-${i % 8}`;
    const initial = name.charAt(0).toUpperCase();

    card.innerHTML = `
      <div class="profile-avatar ${avatarColor}">${initial}</div>
      <div class="profile-name">${escapeHtml(name)}</div>
      <div class="profile-words">${stats.totalWords} words typed</div>
    `;
    list.appendChild(card);
  });
}

function createProfile(name) {
  name = name.trim();
  if (!name) return;

  const profiles = loadProfiles();
  if (profiles[name]) {
    selectProfile(name);
    return;
  }

  profiles[name] = {
    name,
    completedEntries: {},
    entryStats: {},
  };
  saveProfiles(profiles);
  selectProfile(name);
}

function selectProfile(name) {
  currentProfile = name;
  $('new-profile-input').value = '';
  showScreen('category');
}

// ===== CATEGORY SCREEN =====
function renderCategoryScreen() {
  $('player-name').textContent = currentProfile;

  // Profile stats bar
  const stats = getProfileStats(currentProfile);
  $('profile-stats-bar').innerHTML = `
    <div class="stat">Avg WPM: <span class="stat-value">${stats.avgWpm}</span></div>
    <div class="stat">Avg Accuracy: <span class="stat-value">${stats.avgAccuracy}%</span></div>
    <div class="stat">Total Words: <span class="stat-value">${stats.totalWords}</span></div>
  `;

  // Category cards
  const categories = getAllCategories();
  const list = $('categories-list');
  list.innerHTML = '';

  categories.forEach(cat => {
    const entries = getEntriesForCategory(cat.id);
    const completed = getCompletedEntries(currentProfile, cat.id);
    const completedCount = completed.length;
    const totalCount = entries.length;
    const allDone = completedCount >= totalCount;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const card = document.createElement('div');
    card.className = 'category-card';
    card.onclick = () => selectCategory(cat.id);

    card.innerHTML = `
      <span class="category-icon">${cat.icon}</span>
      <div class="category-name">${escapeHtml(cat.name)}</div>
      <div class="category-progress">
        <span class="progress-count">${completedCount} of ${totalCount}</span> completed
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${progress}%"></div>
      </div>
      ${allDone ? '<span class="category-complete-badge">All Complete!</span>' : ''}
    `;
    list.appendChild(card);
  });
}

// ===== GAME SCREEN =====
function selectCategory(categoryId) {
  currentCategory = categoryId;
  loadNextEntry();
}

function loadNextEntry() {
  const entries = getEntriesForCategory(currentCategory);
  if (entries.length === 0) return;

  const completed = getCompletedEntries(currentProfile, currentCategory);
  const unplayed = entries.filter(e => !completed.includes(e.id));

  if (unplayed.length > 0) {
    currentEntry = unplayed[0];
  } else {
    // All completed — pick random
    currentEntry = entries[Math.floor(Math.random() * entries.length)];
  }

  initGameScreen();
}

function initGameScreen() {
  showScreen('game');

  // Reset game state
  gameState = 'waiting';
  typingPosition = 0;
  errors = 0;
  totalKeystrokes = 0;
  startTime = null;
  clearInterval(liveStatsInterval);

  // Set header
  $('entry-title').textContent = currentEntry.title;

  // Set image
  const img = $('entry-image');
  img.src = currentEntry.imageUrl;
  img.alt = currentEntry.title;
  img.style.display = '';

  // Set live stats
  $('live-wpm').textContent = '0 WPM';
  $('live-accuracy').textContent = '100%';

  // Render typing text
  initTypingDisplay(currentEntry.text);

  // Show start overlay
  const overlay = $('start-overlay');
  overlay.classList.add('active');
  $('start-overlay-title').textContent = currentEntry.title;

  // Hide victory
  $('victory-overlay').classList.remove('active');
}

function initTypingDisplay(text) {
  const container = $('typing-text');
  container.innerHTML = '';
  charSpans = [];

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = text[i];
    container.appendChild(span);
    charSpans.push(span);
  }

  if (charSpans.length > 0) {
    charSpans[0].classList.add('current');
  }
}

function startGame() {
  gameState = 'playing';
  startTime = Date.now();
  $('start-overlay').classList.remove('active');

  // Start live stats updates
  liveStatsInterval = setInterval(updateLiveStats, 500);
}

function updateLiveStats() {
  if (gameState !== 'playing' || !startTime) return;

  const elapsed = (Date.now() - startTime) / 60000; // minutes
  if (elapsed <= 0) return;

  const wpm = Math.round((typingPosition / 5) / elapsed);
  const accuracy = totalKeystrokes > 0
    ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)
    : 100;

  $('live-wpm').textContent = `${wpm} WPM`;
  $('live-accuracy').textContent = `${accuracy}%`;
}

function charsMatch(typed, expected) {
  if (typed === expected) return true;
  // Accept base letter for accented characters (e.g. "e" for "é")
  const normalized = expected.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return typed === normalized;
}

function handleTypingKey(e) {
  if (gameState !== 'playing') return;
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  // Handle backspace
  if (e.key === 'Backspace') {
    e.preventDefault();
    if (typingPosition > 0) {
      // Remove current marker from current position
      if (typingPosition < charSpans.length) {
        charSpans[typingPosition].classList.remove('current');
      }
      typingPosition--;
      // Undo error if this character was incorrect
      if (charSpans[typingPosition].classList.contains('incorrect')) {
        errors--;
      }
      // Reset the character state
      charSpans[typingPosition].classList.remove('correct', 'incorrect');
      charSpans[typingPosition].classList.add('current');
      scrollCurrentCharIntoView();
    }
    return;
  }

  if (e.key.length !== 1) return; // only printable characters

  e.preventDefault();

  const expectedChar = currentEntry.text[typingPosition];
  const typedChar = e.key;
  totalKeystrokes++;

  const correct = charsMatch(typedChar, expectedChar);
  if (!correct) errors++;

  // Update display
  charSpans[typingPosition].classList.remove('current');
  charSpans[typingPosition].classList.add(correct ? 'correct' : 'incorrect');

  typingPosition++;

  if (typingPosition < charSpans.length) {
    charSpans[typingPosition].classList.add('current');
    scrollCurrentCharIntoView();
  } else {
    finishGame();
  }
}

function scrollCurrentCharIntoView() {
  if (typingPosition < charSpans.length) {
    const span = charSpans[typingPosition];
    const container = span.closest('.game-typing-wrapper');
    const spanRect = span.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (spanRect.bottom > containerRect.bottom - 20 || spanRect.top < containerRect.top + 20) {
      span.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}

function finishGame() {
  gameState = 'finished';
  clearInterval(liveStatsInterval);

  const elapsed = (Date.now() - startTime) / 60000; // minutes
  const wpm = elapsed > 0 ? Math.round((currentEntry.text.length / 5) / elapsed) : 0;
  const accuracy = totalKeystrokes > 0
    ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)
    : 100;
  const words = currentEntry.text.trim().split(/\s+/).length;

  // Save stats
  const profiles = loadProfiles();
  const profile = profiles[currentProfile];

  if (!profile.completedEntries[currentCategory]) {
    profile.completedEntries[currentCategory] = [];
  }
  if (!profile.completedEntries[currentCategory].includes(currentEntry.id)) {
    profile.completedEntries[currentCategory].push(currentEntry.id);
  }

  profile.entryStats[currentEntry.id] = { wpm, accuracy, words };
  saveProfiles(profiles);

  // Show celebration
  createConfetti();
  showVictory(wpm, accuracy, words);
}

function showVictory(wpm, accuracy, words) {
  const categories = getAllCategories();
  const cat = categories.find(c => c.id === currentCategory);
  const catName = cat ? cat.name : currentCategory;

  $('victory-stats').innerHTML = `
    <div class="victory-stat">
      <span class="victory-stat-value">${wpm}</span>
      <span class="victory-stat-label">WPM</span>
    </div>
    <div class="victory-stat">
      <span class="victory-stat-value">${accuracy}%</span>
      <span class="victory-stat-label">Accuracy</span>
    </div>
    <div class="victory-stat">
      <span class="victory-stat-value">${words}</span>
      <span class="victory-stat-label">Words</span>
    </div>
  `;

  $('victory-category-name').textContent = catName;
  $('victory-overlay').classList.add('active');
}

function playNextEntry() {
  $('victory-overlay').classList.remove('active');
  loadNextEntry();
}

function pickNewCategory() {
  $('victory-overlay').classList.remove('active');
  showScreen('category');
}

// ===== ADD ENTRY =====
function showAddEntryModal() {
  const select = $('entry-category-select');
  select.innerHTML = '<option value="">-- Select a category --</option>';

  const categories = getAllCategories();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });

  // Add "Create New" option
  const newOption = document.createElement('option');
  newOption.value = '__new__';
  newOption.textContent = '+ Create New Category';
  select.appendChild(newOption);

  // Reset form
  $('add-entry-form').reset();
  $('new-category-group').style.display = 'none';

  $('add-entry-overlay').classList.add('active');
}

function hideAddEntryModal() {
  $('add-entry-overlay').classList.remove('active');
}

function submitNewEntry(e) {
  e.preventDefault();

  const select = $('entry-category-select');
  let categoryId = select.value;
  let categoryName = '';

  if (categoryId === '__new__') {
    categoryName = $('new-category-input').value.trim();
    if (!categoryName) return;
    categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  } else if (categoryId) {
    const cat = getAllCategories().find(c => c.id === categoryId);
    categoryName = cat ? cat.name : categoryId;
  } else {
    return;
  }

  const title = $('entry-title-input').value.trim();
  const imageUrl = $('entry-image-input').value.trim();
  const text = $('entry-text-input').value.trim();

  if (!title || !text) return;

  const newEntry = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    category: categoryId,
    categoryName,
    title,
    imageUrl: imageUrl || '',
    text,
  };

  const customEntries = loadCustomEntries();
  customEntries.push(newEntry);
  saveCustomEntries(customEntries);

  hideAddEntryModal();

  // Refresh current screen
  if (screens.home.classList.contains('active')) renderHomeScreen();
  if (screens.category.classList.contains('active')) renderCategoryScreen();
}

// ===== CONFETTI =====
function createConfetti() {
  const container = $('confetti-container');
  container.innerHTML = '';

  const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6'];

  for (let i = 0; i < 80; i++) {
    const confetto = document.createElement('div');
    confetto.className = 'confetto';
    confetto.style.left = Math.random() * 100 + '%';
    confetto.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetto.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetto.style.animationDelay = Math.random() * 1.5 + 's';
    confetto.style.setProperty('--rotation', (Math.random() * 1440 - 720) + 'deg');
    confetto.style.width = (Math.random() * 8 + 6) + 'px';
    confetto.style.height = (Math.random() * 10 + 8) + 'px';
    container.appendChild(confetto);
  }

  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

// ===== UTILITY =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Home screen
  $('create-profile-btn').addEventListener('click', () => {
    createProfile($('new-profile-input').value);
  });

  $('new-profile-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createProfile($('new-profile-input').value);
    }
  });

  $('add-entry-btn').addEventListener('click', showAddEntryModal);

  // Category screen
  $('back-to-home-btn').addEventListener('click', () => {
    currentProfile = null;
    showScreen('home');
  });

  // Game screen
  $('back-to-categories-btn').addEventListener('click', () => {
    gameState = 'idle';
    clearInterval(liveStatsInterval);
    showScreen('category');
  });

  // Victory popup
  $('play-next-btn').addEventListener('click', playNextEntry);
  $('pick-category-btn').addEventListener('click', pickNewCategory);

  // Add entry modal
  $('entry-category-select').addEventListener('change', (e) => {
    $('new-category-group').style.display = e.target.value === '__new__' ? '' : 'none';
  });

  $('add-entry-form').addEventListener('submit', submitNewEntry);
  $('cancel-entry-btn').addEventListener('click', hideAddEntryModal);
  $('close-modal-btn').addEventListener('click', hideAddEntryModal);

  // Global keyboard handler
  document.addEventListener('keydown', (e) => {
    // Ignore if a form input is focused (except during game)
    const tag = document.activeElement.tagName;
    const isFormInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    // Game: start overlay
    if (gameState === 'waiting' && e.key === 'Enter') {
      e.preventDefault();
      startGame();
      return;
    }

    // Game: typing
    if (gameState === 'playing' && !isFormInput) {
      handleTypingKey(e);
      return;
    }

    // Victory popup shortcuts
    if (gameState === 'finished' && $('victory-overlay').classList.contains('active')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        playNextEntry();
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        pickNewCategory();
        return;
      }
    }
  });

  // Close modal on backdrop click
  $('add-entry-overlay').addEventListener('click', (e) => {
    if (e.target === $('add-entry-overlay')) hideAddEntryModal();
  });

  $('victory-overlay').addEventListener('click', (e) => {
    if (e.target === $('victory-overlay')) return; // Don't close victory on backdrop
  });

  // Initialize
  showScreen('home');
});
