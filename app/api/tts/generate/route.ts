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

        // Extract additional parameters
        const speed = formData.get('speed');
        const gain = formData.get('gain');
        const sampleRate = formData.get('sample_rate');
        const emotionPrompt = formData.get('emotion_prompt');
        const shouldUsePromptForEmotion = formData.get('should_use_prompt_for_emotion') === 'true';

        // Determine model from voice if possible
        let finalModel = model;
        // Only extract model from voice if it's NOT a custom voice (speech:...)
        if (voice && voice.includes(':') && !voice.startsWith('speech:')) {
            finalModel = voice.split(':')[0];
        }

        console.log(`[TTS Debug] Received. Model=${model}, Voice=${voice}, FinalModel=${finalModel}`);

        // Determine voice and request body
        let requestBody: any = {
            model: finalModel,
            input: text,
            response_format: 'mp3', // Changed to mp3 to match doc example for CosyVoice2
        };

        // Add optional parameters if present
        if (speed) requestBody.speed = parseFloat(speed as string);
        if (gain) requestBody.gain = parseFloat(gain as string);
        if (sampleRate) requestBody.sample_rate = parseInt(sampleRate as string);
        if (emotionPrompt) requestBody.emotion_prompt = emotionPrompt;
        if (shouldUsePromptForEmotion) requestBody.should_use_prompt_for_emotion = shouldUsePromptForEmotion;

        if (referenceAudio) {
            // Voice Cloning - Step 1: Upload Voice (Base64 JSON method)
            console.log("Starting Voice Cloning Upload (Base64)...");

            const arrayBuffer = await referenceAudio.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Audio = buffer.toString('base64');
            const mimeType = referenceAudio.type || 'audio/mpeg'; // Default to mp3 if unknown, or match file
            // Ensure the data URI is correct. User example: "data:audio/mpeg;base64,..."
            const audioDataUri = `data:${mimeType};base64,${base64Audio}`;

            const uploadPayload = {
                model: finalModel, // Changed to use the user-selected model
                customName: `voice-${uuidv4()}`,
                audio: audioDataUri,
                text: referenceText || "Placeholder text for voice cloning"
            };

            // Sync model for generation
            // requestBody.model = 'FunAudioLLM/CosyVoice2-0.5B';

            const uploadResponse = await fetch("https://api.siliconflow.com/v1/uploads/audio/voice", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(uploadPayload)
            });

            if (!uploadResponse.ok) {
                const errText = await uploadResponse.text();
                console.error("Voice Upload Failed:", errText);
                throw new Error(`Voice Upload Failed: ${errText}`);
            }

            const uploadData = await uploadResponse.json();
            console.log("Voice Uploaded, URI:", uploadData.uri);

            // Step 2: Use URI for generation
            requestBody.voice = uploadData.uri;

        } else {
            // System Voice
            // Use provided voice or default to Charles
            requestBody.voice = voice || "fishaudio/fish-speech-1.5:charles";
        }

        console.log("Sending Generation Request:", JSON.stringify(requestBody, null, 2));

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
        const filename = `${uuidv4()}.mp3`; // Changed extension to mp3
        const key = `audio/${filename}`;

        const uploadCommand = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(audioBuffer),
            ContentType: 'audio/mpeg', // Changed content type
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
