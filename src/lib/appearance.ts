/** @file Keeps Lab's appearance preference local and synchronizes the document and open tabs. */

export type Appearance = 'light' | 'dark';
export const APPEARANCE_KEY = 'lab.theme.v1';
const APPEARANCE_CHANGE_EVENT = 'lab:appearance';

// This is a fixed, trusted script. It runs before hydration to avoid a light flash on saved dark visits.
export const APPEARANCE_BOOTSTRAP = `try{if(localStorage.getItem('lab.theme.v1')==='dark'){document.documentElement.dataset.theme='dark';document.querySelector('meta[name="theme-color"]').content='#10161f'}}catch{}`;

/** Reads the already-applied document state without accessing another application's storage. */
export function getAppearance(): Appearance {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** Keeps optional controls out of the server and no-JavaScript presentation. */
export function getServerAppearance(): null {
  return null;
}

/** Updates the document and browser chrome without persisting or transmitting anything. */
function updateDocumentAppearance(appearance: Appearance): void {
  document.documentElement.dataset.theme = appearance;
  const themeColorElement = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColorElement) themeColorElement.content = appearance === 'dark' ? '#10161f' : '#ffffff';
}

/** Changes only Lab's appearance preference, retaining a usable control if storage is blocked. */
export function setAppearance(appearance: Appearance): boolean {
  updateDocumentAppearance(appearance);
  let preferenceWasSaved = true;
  try {
    localStorage.setItem(APPEARANCE_KEY, appearance);
  } catch {
    preferenceWasSaved = false;
  }
  window.dispatchEvent(new Event(APPEARANCE_CHANGE_EVENT));
  return preferenceWasSaved;
}

/** Connects React to appearance changes in this document and other tabs, with complete cleanup. */
export function subscribeAppearance(notifyAppearanceChange: () => void): () => void {
  /** Applies another tab's preference without writing it back to storage. */
  function handleStorageChange(storageEvent: StorageEvent): void {
    if (storageEvent.key !== APPEARANCE_KEY && storageEvent.key !== null) return;
    updateDocumentAppearance(storageEvent.newValue === 'dark' ? 'dark' : 'light');
    notifyAppearanceChange();
  }
  window.addEventListener(APPEARANCE_CHANGE_EVENT, notifyAppearanceChange);
  window.addEventListener('storage', handleStorageChange);

  /** Removes both event subscriptions when the appearance control unmounts. */
  return function unsubscribeAppearance(): void {
    window.removeEventListener(APPEARANCE_CHANGE_EVENT, notifyAppearanceChange);
    window.removeEventListener('storage', handleStorageChange);
  };
}
