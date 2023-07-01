import { store } from "../store/store";
import { unloadTasksFromLS } from "../slices/sliceTask";
import { LocalStorage } from "./LocalStorage";

export const storage = new LocalStorage("@djess-v/my-calendar");

export async function loadInitialDataIntoStore() {
  await storage.createStorage();
  // localStorage.setItem("@djess-v/my-calendar", "[]");
  const defaultTask = await storage.fetchAll();

  store.dispatch(unloadTasksFromLS(defaultTask));
}
