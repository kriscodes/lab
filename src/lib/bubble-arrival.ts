/** Decides whether this document gets a home welcome, without cookies or saved visit state. */

/** Allow one home arrival per document; a refresh creates a fresh gate, while history does not. */
export function createHomeArrivalGate(
  initialDocumentPathname: string,
  navigationType: string,
): (currentPathname: string) => boolean {
  let initialLoadPending = true;

  /** Consume the initial-load decision even when navigation or motion preferences skip it. */
  return function claimHomeArrival(currentPathname: string): boolean {
    if (!initialLoadPending) return false;
    initialLoadPending = false;
    return (
      initialDocumentPathname === '/' &&
      currentPathname === '/' &&
      navigationType !== 'back_forward'
    );
  };
}
