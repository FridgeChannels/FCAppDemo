import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;
const API_URL = "https://api.siliconflow.com/v1/audio/speech";

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || 'sa-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function POST(request: NextRequest) {
    try {
        if (!SILICONFLOW_API_KEY) {
            return NextResponse.json({ error: 'Missing SiliconFlow API Key' }, { status: 500 });
        }

        if (!S3_BUCKET_NAME) {
            return NextResponse.json({ error: 'Missing S3 Bucket Name' }, { status: 500 });
        }

        const formData = await request.formData();
        const text = formData.get('text') as string;
        const model = formData.get('model') as string || 'fishaudio/fish-speech-1.5';
        const referenceAudio = formData.get('referenceAudio') as File | null;
        const referenceText = formData.get('referenceText') as string | null;

        const voice = formData.get('voice') as string;

        // Determine model from voice if possible
        let finalModel = model;
        if (voice && voice.includes(':')) {
            finalModel = voice.split(':')[0];
        }

        // Determine voice and request body
        let requestBody: any = {
            model: finalModel,
            input: text,
            response_format: 'wav',
        };

        if (referenceAudio) {
            // Voice Cloning
            const arrayBuffer = await referenceAudio.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Audio = buffer.toString('base64');
            const mimeType = referenceAudio.type || 'audio/wav';
            const dataUri = `data:${mimeType};base64,${base64Audio}`;

            requestBody.voice = ""; // specific for cloning? or maybe just omit?
            // If cloning, we might not want to override model with voice's model unless necessary?
            // Actually, for cloning, the model passed in formData (default fish-speech-1.5) is probably correct.
            // But if the user selected a voice AND clicked clone (which is disabled in UI), we should be careful.
            // In UI, if showTtsClone is true, voice selection is disabled.
            // But let's keep logic safe.
            requestBody.model = model; // use original model param for cloning (default fish-speech)

            requestBody.extra_body = {
                references: [
                    {
                        audio: dataUri,
                        text: referenceText || "Placeholder text if needed"
                    }
                ]
            };
        } else {
            // System Voice
            // Use provided voice or default to Charles
            requestBody.voice = voice || "fishaudio/fish-speech-1.5:charles";
        }

        // Call SiliconFlow API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("SiliconFlow API Error:", errorText);

            // Check for insufficient quota error specifically
            if (errorText.includes('"code":30011')) {
                return NextResponse.json({ error: `API Limit Reached: ${errorText}` }, { status: 403 });
            }

            return NextResponse.json({ error: `API Error: ${response.status} ${errorText}` }, { status: response.status });
        }

        // Get Audio Data
        const audioBuffer = await response.arrayBuffer();

        // Upload to S3
        const filename = `${uuidv4()}.wav`;
        const key = `audio/${filename}`;

        const uploadCommand = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(audioBuffer),
            ContentType: 'audio/wav',
            // ACL: 'public-read' // Not strictly required if bucket policy is public, but good for explicit access if allowed. 
            // Many modern buckets block ACLs. Assuming bucket is configured for public access or we use standard URL.
        });

        await s3Client.send(uploadCommand);

        // Construct Public URL
        // Standard S3 URL pattern: https://bucket-name.s3.region.amazonaws.com/key
        // Verify region for URL construction.
        const region = process.env.AWS_DEFAULT_REGION || 'sa-east-1';
        const publicUrl = `https://${S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error("TTS Generation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
