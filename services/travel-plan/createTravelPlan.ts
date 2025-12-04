"use server";

import { serverFetch } from "@/lib/serverFetch";
import { zodValidator } from "@/lib/zodValidator";
import { travelPlanZodSchema } from "@/zod/travelPlan.zodSchema";

export async function createTravelPlan(
    prevState: any,
    formData: FormData
) {
    try {
        const payload = {
            destination: formData.get("destination") as string,
            startDate: formData.get("startDate") as string,
            endDate: formData.get("endDate") as string,
            budgetRange: formData.get("budgetRange") as string,
            travelType: formData.get("travelType") as string,
            description: formData.get("description") as string,
            visibility: (formData.get("visibility") === 'true'),
        };

        console.log(payload, 'my payload')

        if (zodValidator(payload, travelPlanZodSchema).success === false) {
            return zodValidator(payload, travelPlanZodSchema);
        }

        const validatedPayload: any = zodValidator(payload, travelPlanZodSchema).data;

        const travelPlanData = {
            destination: validatedPayload.destination,
            startDate: new Date(validatedPayload.startDate),
            endDate: new Date(validatedPayload.endDate),
            budgetRange: validatedPayload.budgetRange ?? undefined,
            travelType: validatedPayload.travelType,
            description: validatedPayload.description ?? undefined,
            visibility: validatedPayload.visibility ?? true,
        };

        const res = await serverFetch.post('/travel-plan', {
            body: JSON.stringify(travelPlanData)
        })

        const result = await res.json()

        return result

    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        console.log('Error while creating travel plan', error)
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : "Travel plan creation failed."}` };
    }
}
