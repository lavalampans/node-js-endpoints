import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// Define types
export type Event = {
  id: string;
  name: string;
  date: string;
};

type Data = {
  events: Event[];
};

const adapter = new JSONFile<Data>("db.json");
export const db = new Low<Data>(adapter, { events: [] });

export const initDB = async () => {
  await db.read();
  db.data ||= { events: [] };
  await db.write();
};
