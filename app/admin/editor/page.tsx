'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { NewsletterData } from '@/lib/types/notion';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const TEMPLATES = [
    { key: 'magnet-red-thick', label: 'Magnet Red (Default)' },
    { key: 'magnet-green-thick', label: 'Magnet Green' }
];

const MODEL_OPTIONS = [
    // { label: 'Fish Speech 1.5', value: 'fishaudio/fish-speech-1.5' },
    // { label: 'CosyVoice 2 0.5B', value: 'FunAudioLLM/CosyVoice2-0.5B' },
    { label: 'Index TTS 2', value: 'IndexTeam/IndexTTS-2' }
];

const VOICE_OPTIONS = [
    {
        label: "男生音色",
        options: [
            { name: "用户上传 (0dd3...)", value: "speech:voice-0dd33f4a-c48f-49de-a76e-14030c61aedc:d56evi10hh4s716978v0:vrvoarhgqqpbauocruzr" },
            { name: "沉稳男声 (Alex)", value: "alex" },
            { name: "低沉男声 (Benjamin)", value: "benjamin" },
            { name: "磁性男声 (Charles)", value: "charles" },
            { name: "欢快男声 (David)", value: "david" },
        ]
    },
    {
        label: "女生音色",
        options: [
            { name: "沉稳女声 (Anna)", value: "anna" },
            { name: "激情女声 (Bella)", value: "bella" },
            { name: "温柔女声 (Claire)", value: "claire" },
            { name: "欢快女声 (Diana)", value: "diana" },
        ]
    }
];

export default function NewsletterEditorPage() {
    const [templateKey, setTemplateKey] = useState(TEMPLATES[0].key);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [ttsGenerating, setTtsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [newsletter, setNewsletter] = useState<NewsletterData | null>(null);
    const [formData, setFormData] = useState<Partial<NewsletterData>>({});

    // TTS State
    const [showTtsClone, setShowTtsClone] = useState(false);
    const [refAudioFile, setRefAudioFile] = useState<File | null>(null);
    const [refText, setRefText] = useState('');
    const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value);
    const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].options[0].value);

    // TTS Optional Params
    const [ttsSpeed, setTtsSpeed] = useState('1.1');
    const [ttsEmotionPrompt, setTtsEmotionPrompt] = useState('Respond softly and kindly, with a thoughtful tone.');

    // AI Generation State
    const [aiGenerating, setAiGenerating] = useState<{ [key: string]: boolean }>({});
    const [aiCost, setAiCost] = useState<{ [key: string]: number }>({});
    const [aiUsage, setAiUsage] = useState<{ [key: string]: any }>({});

    // React Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const fetchNewsletter = useCallback(async (key: string) => {
        setSearching(true);
        setError(null);
        setSuccess(null);
        // setNewsletter(null); // Keep existing data while fetching to avoid flicker

        try {
            const response = await fetch(`/api/newsletter/${key}`);
            if (!response.ok) {
                throw new Error('Newsletter not found or error fetching data');
            }
            const data = await response.json();
            setNewsletter(data);
            // Initialize form data
            setFormData({
                title: data.title,
                author: data.author,
                content: data.content,
                time: data.time,
                annualPrice: data.annualPrice,
                monthlyPrice: data.monthlyPrice,
                ctaText: data.ctaText || '',
                benefits: data.benefits || [],
                consume: data.consume || '',
                ttsUrl: data.ttsUrl,
                benefitsPrompt: data.benefitsPrompt,
                consumePrompt: data.consumePrompt
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setSearching(false);
        }
    }, []);

    // Initial fetch on mount or template change
    useEffect(() => {
        fetchNewsletter(templateKey);
    }, [templateKey, fetchNewsletter]);

    const handleInputChange = (field: keyof NewsletterData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBenefitsChange = (value: string) => {
        // Split by newlines to create array
        const benefitsArray = value.split('\n');
        handleInputChange('benefits', benefitsArray);
    };

    const handleSave = async (dataToSave = formData) => {
        if (!newsletter) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/newsletter/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageId: newsletter.id,
                    data: dataToSave
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update newsletter');
            }

            setSuccess('Newsletter updated successfully!');

            // Refresh data
            fetchNewsletter(templateKey);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during save');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTTS = async () => {
        if (!formData.consume) {
            setError("Please ensure 'Consume' text is filled before generating TTS.");
            return;
        }

        setTtsGenerating(true);
        setError(null);

        try {
            const form = new FormData();
            form.append('text', formData.consume);

            // Construct the full voice string: model:voice
            // Example: fishaudio/fish-speech-1.5:alex
            // If the voice is a custom uploaded voice (starts with speech:), use it as is.
            const fullVoiceString = selectedVoice.startsWith('speech:')
                ? selectedVoice
                : `${selectedModel}:${selectedVoice}`;
            form.append('voice', fullVoiceString);
            form.append('model', selectedModel);
            form.append('speed', ttsSpeed);
            form.append('emotion_prompt', ttsEmotionPrompt);
            form.append('should_use_prompt_for_emotion', 'true');

            if (showTtsClone && refAudioFile) {
                form.append('referenceAudio', refAudioFile);
                if (refText) form.append('referenceText', refText);
            }

            const response = await fetch('/api/tts/generate', {
                method: 'POST',
                body: form,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'TTS Generation failed');
            }

            const data = await response.json();

            // Update form data with new URL
            const updatedFormData = { ...formData, ttsUrl: data.url };
            setFormData(updatedFormData);

            // Auto-save to Notion
            await handleSave(updatedFormData);

            setSuccess("TTS generated and saved successfully!");

        } catch (err) {
            setError(err instanceof Error ? err.message : 'TTS error');
        } finally {
            setTtsGenerating(false);
        }
    };

    const handleGenerateAI = async (type: 'benefits' | 'consume') => {
        const prompt = type === 'benefits' ? formData.benefitsPrompt : formData.consumePrompt;
        const content = formData.content; // Use rich text content (html) or plain text? Ideally plain text content but we have HTML from quill. 
        // For GPT, HTML is fine, it understands it.

        if (!prompt) {
            setError(`Please enter a prompt for ${type} generation.`);
            return;
        }
        if (!content) {
            setError("Please ensure Main Content is filled before generating.");
            return;
        }

        setAiGenerating(prev => ({ ...prev, [type]: true }));
        setError(null);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, content })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'AI Generation failed');
            }

            const data = await response.json();

            // Update form data
            if (type === 'benefits') {
                // Expecting JSON array string or just list? Prompt says "Output json array".
                // We should probably try to parse it if it looks like JSON, or just split by lines if it's text.
                // The prompt says "strict requirement output json array".
                let benefits = [];
                try {
                    // Start looking for [ and end with ]
                    const jsonStart = data.generatedText.indexOf('[');
                    const jsonEnd = data.generatedText.lastIndexOf(']');
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                        const jsonStr = data.generatedText.substring(jsonStart, jsonEnd + 1);
                        benefits = JSON.parse(jsonStr);
                    } else {
                        // Fallback: split by newlines
                        benefits = data.generatedText.split('\n').filter((line: string) => line.trim().length > 0);
                    }
                } catch (e) {
                    console.warn("Failed to parse benefits JSON, using raw split", e);
                    benefits = data.generatedText.split('\n').filter((line: string) => line.trim().length > 0);
                }

                // If parsed result is array of objects/strings, ensure string array
                if (Array.isArray(benefits)) {
                    // If it's array of strings, good. 
                    // If prompt returns objects (e.g. {value: "..."}), map it? Prompt says "key value points list"? No "Only output key value point list". 
                    // Let's assume string array.
                    setFormData(prev => ({ ...prev, benefits: benefits.map((b: any) => typeof b === 'string' ? b : JSON.stringify(b)) }));
                }

            } else {
                setFormData(prev => ({ ...prev, consume: data.generatedText }));
            }

            // Track cost
            setAiCost(prev => ({ ...prev, [type]: data.cost }));
            setAiUsage(prev => ({ ...prev, [type]: data.usage }));

            setSuccess(`${type === 'benefits' ? 'Benefits' : 'Content to Speak'} generated successfully! Cost: $${data.cost.toFixed(6)}`);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI Generation error');
        } finally {
            setAiGenerating(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Newsletter Editor</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and update your newsletter content.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <span className="text-sm font-medium text-gray-600">Template:</span>
                            <select
                                value={templateKey}
                                onChange={(e) => setTemplateKey(e.target.value)}
                                className="bg-transparent border-none text-sm font-semibold text-gray-900 focus:ring-0 cursor-pointer py-0 pl-2 pr-8"
                                disabled={searching || loading}
                            >
                                {TEMPLATES.map(t => (
                                    <option key={t.key} value={t.key}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {searching && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-500">Loading editor...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form Area */}
                {!searching && newsletter && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Content & Metadata (2/3 width) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Section: Basic Info */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                                    <span className="text-xs font-mono text-gray-400">ID: {newsletter.id.slice(0, 8)}...</span>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Title</label>
                                        <input type="text" className="input-field-premium font-medium text-lg w-full border border-gray-200" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                        <input type="text" className="input-field-premium w-full border border-gray-200" value={formData.author || ''} onChange={(e) => handleInputChange('author', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Publish Time</label>
                                        <input type="text" className="input-field-premium w-full border border-gray-200" value={formData.time || ''} onChange={(e) => handleInputChange('time', e.target.value)} />
                                    </div>
                                </div>
                            </section>

                            {/* Section: Rich Content */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="text-lg font-semibold text-gray-900">Main Content</h2>
                                </div>
                                <div className="p-6">
                                    <div className="bg-white rounded-lg">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.content || ''}
                                            onChange={(value) => handleInputChange('content', value)}
                                            modules={modules}
                                            className="h-96 mb-12"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section: Extra Content */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text (Call to Action)</label>
                                        <textarea rows={2} className="input-field-premium resize-none w-full border border-gray-200" value={formData.ctaText || ''} onChange={(e) => handleInputChange('ctaText', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Benefits List (One item per line)</label>
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => handleGenerateAI('benefits')}
                                                disabled={aiGenerating['benefits'] || !formData.benefitsPrompt}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                {aiGenerating['benefits'] ? 'Generating...' : '✨ Generate with AI'}
                                            </button>
                                            {aiCost['benefits'] !== undefined && (
                                                <span className="text-xs text-green-600 flex items-center">
                                                    Cost: ${aiCost['benefits'].toFixed(4)}
                                                    (In: {aiUsage['benefits']?.prompt_tokens}, Out: {aiUsage['benefits']?.completion_tokens})
                                                </span>
                                            )}
                                        </div>
                                        <textarea rows={5} className="input-field-premium font-mono text-sm leading-relaxed w-full border border-gray-200" value={formData.benefits ? formData.benefits.join('\n') : ''} onChange={(e) => handleBenefitsChange(e.target.value)} />

                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Benefits Prompt</label>
                                            <textarea
                                                rows={3}
                                                className="input-field-premium w-full border border-gray-200 text-xs font-mono text-gray-600"
                                                value={formData.benefitsPrompt || ''}
                                                onChange={(e) => handleInputChange('benefitsPrompt', e.target.value)}
                                                placeholder="Prompt for generating benefits..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Pricing & TTS & Actions (1/3 width) */}
                        <div className="space-y-8">

                            {/* Pricing Section */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Price</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <input type="text" className="input-field-premium w-full border border-gray-200" value={formData.annualPrice || ''} onChange={(e) => handleInputChange('annualPrice', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <input type="text" className="input-field-premium w-full border border-gray-200" value={formData.monthlyPrice || ''} onChange={(e) => handleInputChange('monthlyPrice', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* TTS Section */}
                            <section className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                    <h2 className="text-lg font-semibold text-purple-900">Voice Generation</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content to Speak</label>
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => handleGenerateAI('consume')}
                                                disabled={aiGenerating['consume'] || !formData.consumePrompt}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                            >
                                                {aiGenerating['consume'] ? 'Generating...' : '✨ Generate with AI'}
                                            </button>
                                            {aiCost['consume'] !== undefined && (
                                                <span className="text-xs text-green-600 flex items-center">
                                                    Cost: ${aiCost['consume'].toFixed(4)}
                                                    (In: {aiUsage['consume']?.prompt_tokens}, Out: {aiUsage['consume']?.completion_tokens})
                                                </span>
                                            )}
                                        </div>
                                        <textarea
                                            rows={5}
                                            className="input-field-premium bg-white w-full border border-gray-200"
                                            value={formData.consume || ''}
                                            onChange={(e) => handleInputChange('consume', e.target.value)}
                                            placeholder="Enter text here..."
                                        />

                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Consume Prompt</label>
                                            <textarea
                                                rows={3}
                                                className="input-field-premium w-full border border-gray-200 text-xs font-mono text-gray-600"
                                                value={formData.consumePrompt || ''}
                                                onChange={(e) => handleInputChange('consumePrompt', e.target.value)}
                                                placeholder="Prompt for generating consume text..."
                                            />
                                        </div>
                                    </div>

                                    {/* Model Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Model</label>
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="input-field-premium w-full border border-gray-200"
                                            disabled={showTtsClone}
                                        >
                                            {MODEL_OPTIONS.map((model) => (
                                                <option key={model.value} value={model.value}>
                                                    {model.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Voice Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Voice</label>
                                        <select
                                            value={selectedVoice}
                                            onChange={(e) => setSelectedVoice(e.target.value)}
                                            className="input-field-premium w-full border border-gray-200"
                                            disabled={showTtsClone}
                                        >
                                            {VOICE_OPTIONS.map((group) => (
                                                <optgroup key={group.label} label={group.label}>
                                                    {group.options.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.name}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                        {showTtsClone && <p className="text-xs text-orange-500 mt-1">Voice selection is disabled when using Voice Cloning.</p>}
                                    </div>

                                    {/* Advanced Params: Speed & Emotion */}
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
                                            <input
                                                type="number"
                                                step="0.05"
                                                min="0.5"
                                                max="2.0"
                                                value={ttsSpeed}
                                                onChange={(e) => setTtsSpeed(e.target.value)}
                                                className="input-field-premium w-full border border-gray-200"
                                                placeholder="1.05"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Emotion Prompt</label>
                                            <textarea
                                                rows={2}
                                                value={ttsEmotionPrompt}
                                                onChange={(e) => setTtsEmotionPrompt(e.target.value)}
                                                className="input-field-premium w-full border border-gray-200 text-xs"
                                                placeholder="e.g. Respond softly..."
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white/50 p-4 rounded-lg border border-purple-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <input
                                                type="checkbox"
                                                id="cloneVoice"
                                                checked={showTtsClone}
                                                onChange={(e) => setShowTtsClone(e.target.checked)}
                                                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            />
                                            <label htmlFor="cloneVoice" className="text-sm font-medium text-gray-800">Use Voice Cloning</label>
                                        </div>

                                        {showTtsClone && (
                                            <div className="space-y-3 pl-6 border-l-2 border-purple-200 ml-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Audio File</label>
                                                    <input
                                                        type="file"
                                                        accept="audio/*"
                                                        onChange={(e) => setRefAudioFile(e.target.files?.[0] || null)}
                                                        className="text-xs mt-1 w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Transcript</label>
                                                    <input
                                                        type="text"
                                                        value={refText}
                                                        onChange={(e) => setRefText(e.target.value)}
                                                        placeholder="Optional text transcript"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-xs py-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleGenerateTTS}
                                        disabled={loading || ttsGenerating || !formData.consume}
                                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                                    >
                                        {ttsGenerating ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Processing...
                                            </span>
                                        ) : 'Generate Audio'}
                                    </button>

                                    {formData.ttsUrl && (
                                        <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-purple-700 uppercase">Preview</span>
                                                <a href={formData.ttsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline">
                                                    Open File <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                </a>
                                            </div>
                                            <audio controls src={formData.ttsUrl} className="w-full h-8" />
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Actions Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 sticky top-6 z-10">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Actions</h3>
                                <button
                                    type="button"
                                    onClick={() => handleSave()}
                                    disabled={loading || ttsGenerating}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform active:scale-95"
                                >
                                    {loading ? 'Saving Changes...' : 'Save All Changes'}
                                </button>
                                {success && (
                                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium animate-fade-in">
                                        {success}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
            <style jsx>{`
            .input-field-premium {
                @apply mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-colors duration-200 border;
            }
            .input-field-premium:focus {
                @apply ring-2 ring-indigo-500/20 border-indigo-500;
            }
            `}</style>
        </div >
    );
}

