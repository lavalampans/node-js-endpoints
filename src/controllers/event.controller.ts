import { Request, Response, NextFunction } from "express";
import { eventService } from "../services/event.service";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
});

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const nameFilter = req.query.name as string | undefined;

    let events = await eventService.fetchEvents();

    if (nameFilter) {
      events = events.filter((e) =>
        e.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    const paginated = events.slice((page - 1) * limit, page * limit);

    res.json({
      page,
      limit,
      total: events.length,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

const postEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = eventSchema.parse(req.body);
    const newEvent = await eventService.createEvent(
      parsed.name,
      new Date(parsed.date)
    );
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

const putEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parsed = eventSchema.parse(req.body);

    const updated = await eventService.updateEvent(
      id,
      parsed.name,
      new Date(parsed.date)
    );
    if (!updated) return res.status(404).json({ error: "Event not found" });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await eventService.deleteEvent(id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const eventController = {
  getEvents,
  postEvent,
  putEvent,
  deleteEvent,
};
