import { db, Event } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

const fetchEvents = async (): Promise<Event[]> => {
  await db.read();
  return db.data!.events;
};

const createEvent = async (name: string, date: Date): Promise<Event> => {
  await db.read();

  const newEvent: Event = {
    id: uuidv4(),
    name,
    date: date.toISOString(),
  };

  db.data!.events.push(newEvent);
  await db.write();

  return newEvent;
};

const updateEvent = async (
  id: string,
  name: string,
  date: Date
): Promise<Event | null> => {
  await db.read();
  const event = db.data!.events.find((e) => e.id === id);
  if (!event) return null;

  event.name = name;
  event.date = date.toISOString();
  await db.write();
  return event;
};

const deleteEvent = async (id: string): Promise<boolean> => {
  await db.read();
  const index = db.data!.events.findIndex((e) => e.id === id);
  if (index === -1) return false;

  db.data!.events.splice(index, 1);
  await db.write();
  return true;
};

export const eventService = {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
