import z from 'zod'

export const travelPlanZodSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budgetRange: z.string().optional().nullable(),
  travelType: z.string().min(1, "Travel type is required"),
  description: z.string().optional().nullable(),
  visibility: z.string().optional(),
});