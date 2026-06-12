import { db } from "@/firebase";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { type TMDBItem } from "@/lib/tmdb";

export interface WatchlistEntry {
  item: TMDBItem;
  mediaType: string;
  addedAt: string;
}

export interface HistoryEntry {
  item: TMDBItem;
  mediaType: string;
  watchedAt: string;
}

export const syncWatchlist = async (userId: string, entry: WatchlistEntry, action: "add" | "remove") => {
  const userRef = doc(db, "users", userId);
  try {
    if (action === "add") {
      await updateDoc(userRef, {
        watchlist: arrayUnion(entry)
      });
    } else {
      // For removal, we need the exact object or we can filter it out manually
      // arrayRemove needs the exact object. Since addedAt might differ, it's safer to fetch and update
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const currentWatchlist = docSnap.data().watchlist || [];
        const updatedWatchlist = currentWatchlist.filter((e: any) => e.item.id !== entry.item.id); // eslint-disable-line @typescript-eslint/no-explicit-any
        await updateDoc(userRef, { watchlist: updatedWatchlist });
      }
    }
  } catch (e) {
    console.error("Error syncing watchlist:", e);
    throw e;
  }
};

export const syncHistory = async (userId: string, entry: HistoryEntry) => {
  const userRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const currentHistory = docSnap.data().history || [];
      // Remove existing entry for the same item and add new one at the beginning
      const updatedHistory = [entry, ...currentHistory.filter((h: any) => h.item.id !== entry.item.id)].slice(0, 50); // eslint-disable-line @typescript-eslint/no-explicit-any
      await updateDoc(userRef, { history: updatedHistory });
    }
  } catch (e) {
    console.error("Error syncing history:", e);
    throw e;
  }
};

export const getUserData = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};
