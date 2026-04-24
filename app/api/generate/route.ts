import { model } from "@/app/lib/ai";
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { prisma } from "@/lib/prisma";
const payloadRecordSchema = z.record(z.string(), z.unknown());

const fixedSchema = z.object({
    data: z.union([z.array(payloadRecordSchema), payloadRecordSchema]),
    suggestedPath: z.string().describe('e.g. /products or /users'),
    itemCount: z.number().optional(),
});

const requestSchema = z.object({
    prompt: z.string().min(1, 'prompt is required'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsedBody = requestSchema.safeParse(body);
        
        if (!parsedBody.success) {
            return Response.json(
                { error: 'Invalid request body', details: parsedBody.error.flatten() },
                { status: 400 },
            );
        }

        const { output } = await generateText({
            model,
            output: Output.object({
                name: 'MockApiData',
                description: 'Structured mock payload for REST API prototyping',
                schema: fixedSchema,
            }),
            system: `You are a mock API data generator.
Generate realistic fake JSON data based on the user's description.
Use real-looking names, valid ISO dates, UUID-shaped IDs, realistic prices.
Return an array for collection endpoints, a single object for resource endpoints.
Suggest a sensible REST path for the data.`,
            prompt: parsedBody.data.prompt,
        });

        // const result: GeneratedMockData = output;
        // return Response.json(result);

        const slug= nanoid(8);
        const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        const responsePayload = JSON.parse(JSON.stringify(output));


        await prisma.mockEndpoint.create({
            data: {
                slug,
                label: parsedBody.data.prompt,
                response: responsePayload,
                expiresAt: expiration,
            },
        });
        const url= `${process.env.BASE_URL}/mock/${slug}`;
        return Response.json({
            id: slug,
            data: output,
            expiresAt: expiration.toISOString(),
            url: url,
        });

    } catch (error) {
        return Response.json(
            {
                error: 'Failed to generate structured mock data',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}