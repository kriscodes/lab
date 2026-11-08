export type Appearance = 'light' | 'dark';
export const APPEARANCE_KEY = 'lab.theme.v1';
const CHANGE_EVENT = 'lab:appearance';

// This is a fixed, trusted script. It runs before hydration to avoid a light flash on saved dark visits.
export const APPEARANCE_BOOTSTRAP = `try{if(localStorage.getItem('lab.theme.v1')==='dark'){document.documentElement.dataset.theme='dark';document.querySelector('meta[name="theme-color"]').content='#101113'}}catch{}`;

/** Reads the already-applied document state without accessing another application's storage. */
export function getAppearance(): Appearance {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** Keeps optional controls out of the server and no-JavaScript presentation. */
export function getServerAppearance(): null {
  return null;
}

/** Updates the document and browser chrome without persisting or transmitting anything. */
function updateDocument(appearance: Appearance): void {
  document.documentElement.dataset.theme = appearance;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = appearance === 'dark' ? '#101113' : '#ffffff';
}

/** Changes only Lab's appearance preference, retaining a usable control if storage is blocked. */
export function setAppearance(appearance: Appearance): boolean {
  updateDocument(appearance);
  let persisted = true;
  try {
    localStorage.setItem(APPEARANCE_KEY, appearance);
  } catch {
    persisted = false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return persisted;
}

/** Connects React to appearance changes in this document and other tabs, with complete cleanup. */
export function subscribeAppearance(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== APPEARANCE_KEY && event.key !== null) return;
    updateDocument(event.newValue === 'dark' ? 'dark' : 'light');
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
