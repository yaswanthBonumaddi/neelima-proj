// try {
//     if (process.env.OTEL_ENABLED == 'true') {
//         require('@godspeedsystems/tracing').initialize();
//     }
// } catch (error) {
//     console.error("OTEL_ENABLED is set, unable to initialize opentelemetry tracing.");
//     console.error(error);
//     process.exit(1);
// }

// import Godspeed from "@godspeedsystems/core";

// // create a godspeed
// const gsApp = new Godspeed();
// console.log("SSSSS", gsApp);
// // initilize the Godspeed App
// // this is responsible to load all kind of entities
// gsApp.initialize();
// console.log("LLLLLL", gsApp);

// api/index.ts - Vercel serverless handler with TypeScript
import { Request, Response } from 'express';
import express from 'express';

// Set environment variables for serverless compatibility
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Initialize OpenTelemetry if enabled
try {
  if (process.env.OTEL_ENABLED == 'true') {
    require('@godspeedsystems/tracing').initialize();
  }
} catch (error) {
  console.error(
    'OTEL_ENABLED is set, unable to initialize opentelemetry tracing.',
  );
  console.error(error);
}

import Godspeed from '@godspeedsystems/core';

// Create a singleton instance
let gsApp: Godspeed | null = null;
let expressApp: express.Application | null = null;

async function getApp(): Promise<express.Application> {
  if (!gsApp) {
    try {
      gsApp = new Godspeed();
      await gsApp.initialize();

      // Get the Express app from the HTTP event source
      const httpEventSource = gsApp.eventsources.http;
      if (httpEventSource && httpEventSource.client) {
        expressApp = httpEventSource.client as express.Application;
      } else {
        throw new Error('HTTP event source not found or not initialized');
      }
    } catch (error) {
      console.error('Error initializing Godspeed app:', error);
      throw error;
    }
  }
  return expressApp as express.Application;
}

// Export the handler for Vercel
export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// For compatibility with CommonJS
module.exports = handler;
