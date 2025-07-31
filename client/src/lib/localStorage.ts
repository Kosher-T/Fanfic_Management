import { UserPreferences } from '@shared/schema';

const STORAGE_KEYS = {
  USER_PREFERENCES: 'ficrecs_user_preferences',
  BOOKMARKS: 'ficrecs_bookmarks',
  READING_LIST: 'ficrecs_reading_list',
} as const;

export function getUserPreferences(): UserPreferences {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  if (!stored) {
    const defaultPrefs: UserPreferences = {
      theme: 'dark',
      bookmarkedStories: [],
      readingList: [],
      favoriteGenres: [],
      filters: {}
    };
    saveUserPreferences(defaultPrefs);
    return defaultPrefs;
  }
  return JSON.parse(stored);
}

export function saveUserPreferences(preferences: UserPreferences) {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
}

export function isStoryBookmarked(storyId: string | number): boolean {
  const prefs = getUserPreferences();
  const id = storyId.toString();
  return prefs.bookmarkedStories.includes(id);
}

export function toggleBookmark(storyId: string | number) {
  const prefs = getUserPreferences();
  const id = storyId.toString();
  const isBookmarked = prefs.bookmarkedStories.includes(id);
  
  if (isBookmarked) {
    prefs.bookmarkedStories = prefs.bookmarkedStories.filter(bookmarkId => bookmarkId !== id);
  } else {
    prefs.bookmarkedStories.push(id);
  }
  
  saveUserPreferences(prefs);
  return !isBookmarked;
}

export function isInReadingList(storyId: string | number): boolean {
  const prefs = getUserPreferences();
  const id = storyId.toString();
  return prefs.readingList.includes(id);
}

export function toggleReadingList(storyId: string | number) {
  const prefs = getUserPreferences();
  const id = storyId.toString();
  const isInList = prefs.readingList.includes(id);
  
  if (isInList) {
    prefs.readingList = prefs.readingList.filter(listId => listId !== id);
  } else {
    prefs.readingList.push(id);
  }
  
  saveUserPreferences(prefs);
  return !isInList;
}
