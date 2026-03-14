import { z } from 'zod';

export const ItineraryItemSchema = z.object({
  catalog_item_id: z.string(),
  name: z.string(),
  type: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  notes: z.string().optional(),
  instaworthy_score: z.number().optional(),
  photoTip: z.string().optional(),
  price: z.number().optional(),
  location: z.string().optional()
});

export const ItineraryDaySchema = z.object({
  day: z.number(),
  date: z.string().optional(),
  theme: z.string(),
  items: z.array(ItineraryItemSchema)
});

export const ItinerarySchema = z.array(ItineraryDaySchema);
