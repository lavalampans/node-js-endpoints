import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Events API",
    version: "1.0.0",
    description: "Local API for managing events using LowDB",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
  ],
  paths: {
    "/api/events": {
      get: {
        summary: "Get all events with optional pagination and filtering",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (default 1)",
            required: false,
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Number of events per page (default 10)",
            required: false,
            schema: { type: "integer", default: 10 },
          },
          {
            name: "name",
            in: "query",
            description:
              "Filter events by name (case-insensitive substring match)",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Paginated list of events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    total: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Event" },
                    },
                  },
                  required: ["page", "limit", "total", "data"],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EventInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Event created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Event" },
              },
            },
          },
        },
      },
    },
    "/api/events/{id}": {
      put: {
        summary: "Update an event",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EventInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Event updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Event" },
              },
            },
          },
          404: { description: "Event not found" },
        },
      },
      delete: {
        summary: "Delete an event",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          204: { description: "Event deleted" },
          404: { description: "Event not found" },
        },
      },
    },
  },
  components: {
    schemas: {
      Event: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          date: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "date"],
      },
      EventInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          date: { type: "string", format: "date-time" },
        },
        required: ["name", "date"],
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
