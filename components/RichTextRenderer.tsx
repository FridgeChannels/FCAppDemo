'use client';

import React, { useState, useEffect } from 'react';
import { RichTextElement } from '@/lib/types/notion';

interface RichTextRendererProps {
    richText: RichTextElement[];
}

interface Block {
    type: 'heading' | 'paragraph' | 'list';
    content: RichTextElement[];
    listType?: 'ordered' | 'unordered';
    items?: RichTextElement[][];
}

export function RichTextRenderer({ richText }: RichTextRendererProps) {
    const [mounted, setMounted] = useState(false);

    // Only render on client side to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return null during SSR to avoid hydration mismatch
        return null;
    }

    // Combine all text to check format
    const fullText = richText.map(e => e.plain_text).join('');

    // Check if content looks like HTML (starts with a tag)
    // Basic check: starts with <p, <div, <span, etc.
    const isHTML = /^\s*<[a-z][\s\S]*>/i.test(fullText);

    if (isHTML) {
        return (
            <div
                className="drop-cap-article prose prose-sm sm:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: fullText }}
            />
        );
    }

    // Fallback: Parse as plain text/markdown blocks
    const blocks = parseRichTextIntoBlocks(richText);

    return (
        <div className="prose prose-sm sm:prose-base max-w-none">
            {blocks.map((block, index) => renderBlock(block, index))}
        </div>
    );
}

function parseRichTextIntoBlocks(richText: RichTextElement[]): Block[] {
    const blocks: Block[] = [];

    // First, flatten all rich text elements and split by newlines
    // while preserving formatting information
    interface TextSegment {
        text: string; // The text content of this segment
        originalText: string; // The original full text of the rich text element (for context)
        annotations: RichTextElement['annotations'];
        link: RichTextElement['text']['link'];
    }

    const segments: TextSegment[] = [];

    for (const element of richText) {
        const text = element.plain_text;
        // Split by newlines but keep track of segments
        const parts = text.split('\n');

        parts.forEach((part, index) => {
            if (part.length > 0) {
                segments.push({
                    text: part,
                    originalText: text,
                    annotations: element.annotations,
                    link: element.text.link
                });
            }
            // Add newline marker between parts
            if (index < parts.length - 1) {
                segments.push({
                    text: '\n',
                    originalText: text,
                    annotations: element.annotations,
                    link: null
                });
            }
        });
    }

    // Now group segments into paragraphs/blocks
    let currentBlock: TextSegment[] = [];

    const flushBlock = () => {
        if (currentBlock.length === 0) return;

        // Analyze the full text of the current block
        const fullText = currentBlock.map(s => s.text).join('').trim();
        if (!fullText) return;

        // Check for List Items
        // Unordered: starts with "- ", "* ", "• "
        const unorderedMatch = fullText.match(/^[-*•]\s+(.*)/);
        // Ordered: starts with "1. ", "2. ", etc.
        const orderedMatch = fullText.match(/^(\d+)\.\s+(.*)/);

        if (unorderedMatch || orderedMatch) {
            // It's a list item
            const listType = orderedMatch ? 'ordered' : 'unordered';

            // Clean content: remove the marker
            const markerLength = orderedMatch ? orderedMatch[1].length + 2 : (unorderedMatch ? 2 : 0);

            // Reconstruct content without marker
            // This is tricky with segments, so we'll simplify:
            // If the first segment contains the marker, strip it.
            // If the marker spans multiple segments (unlikely), we might have issues, but let's handle the common case.

            let contentSegments = [...currentBlock];
            let charsToRemove = markerLength;

            // Remove marker characters from the beginning of the segments list
            while (charsToRemove > 0 && contentSegments.length > 0) {
                const seg = contentSegments[0];
                if (seg.text.length <= charsToRemove) {
                    charsToRemove -= seg.text.length;
                    contentSegments.shift();
                } else {
                    // Split this segment
                    const newText = seg.text.substring(charsToRemove);
                    contentSegments[0] = {
                        ...seg,
                        text: newText
                    };
                    charsToRemove = 0;
                }
            }

            // Convert back to RichTextElement
            const content = segmentsToRichText(contentSegments);

            // Check if previous block is a list of the same type to merge
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock && lastBlock.type === 'list' && lastBlock.listType === listType) {
                if (lastBlock.items) {
                    lastBlock.items.push(content);
                }
            } else {
                blocks.push({
                    type: 'list',
                    listType,
                    content: [], // Not used for lists
                    items: [content]
                });
            }
            currentBlock = [];
            return;
        }

        // Heading Detection Rules
        const isBold = currentBlock.every(s => s.annotations.bold || s.text.trim() === '');
        const isShort = fullText.length < 60;
        const endsWithPunctuation = /[.!?]$/.test(fullText);
        // Section headings often start with capital letter and look like titles
        const isTitleCase = /^[A-Z]/.test(fullText);

        // Rule 1: Short, bold text without trailing punctuation (strongest signal)
        const isHeading1 = isShort && isBold && !endsWithPunctuation;

        // Rule 2: Very short bold text (e.g., "Sleep")
        const isHeading2 = fullText.length < 30 && isBold;

        // Rule 3: Text that looks like a section header even if simple boldness varies slightly
        // e.g. "Toxin mitigation" in the example
        const isHeading3 = fullText.length < 40 && isBold && !fullText.includes('\n');

        if (isHeading1 || isHeading2 || isHeading3) {
            blocks.push({ type: 'heading', content: segmentsToRichText(currentBlock) });
        } else {
            blocks.push({ type: 'paragraph', content: segmentsToRichText(currentBlock) });
        }

        currentBlock = [];
    };

    for (const segment of segments) {
        if (segment.text === '\n') {
            // Newline flushes current block
            flushBlock();
        } else {
            currentBlock.push(segment);
            // If the segment text itself contains a block-ending pattern (like double newline logic if we had it), we handle it here
            // For now, we rely on the specific newline segments we inserted
        }
    }

    // Flush remaining
    flushBlock();

    return blocks;
}

function segmentsToRichText(segments: { text: string, annotations: RichTextElement['annotations'], link: RichTextElement['text']['link'] }[]): RichTextElement[] {
    return segments.map(s => ({
        type: 'text',
        text: { content: s.text, link: s.link },
        annotations: s.annotations,
        plain_text: s.text,
        href: s.link?.url || null
    }));
}

function renderBlock(block: Block, index: number): React.ReactNode {
    switch (block.type) {
        case 'heading':
            return (
                <h2
                    key={index}
                    className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 mt-4 sm:mt-5 break-words"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    {renderInlineText(block.content)}
                </h2>
            );

        case 'paragraph':
            // Check for Drop Cap condition: First block, or first paragraph block if first block was just metadata? 
            // Usually index 0 is the start of the article content in this renderer.
            const isFirstParagraph = index === 0;

            if (isFirstParagraph) {
                // We need to separate the first letter from the rest
                const elements = block.content;
                if (elements.length === 0) return null;

                const firstElement = elements[0];
                const text = firstElement.plain_text;

                if (text.length === 0) return null; // Should not happen given parsing logic

                const firstLetter = text.charAt(0);
                const restOfFirstElementText = text.substring(1);

                // Create a new element for the rest of the first text chunk
                const restOfFirstElement = {
                    ...firstElement,
                    text: { ...firstElement.text, content: restOfFirstElementText },
                    plain_text: restOfFirstElementText
                };

                // Remaining elements
                const remainingElements = [restOfFirstElement, ...elements.slice(1)];

                return (
                    <p
                        key={index}
                        className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 break-words text-gray-800"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        <span className="text-5xl sm:text-6xl font-serif float-left leading-none mr-2 pt-1">
                            {firstLetter}
                        </span>
                        <span>
                            {renderInlineText(remainingElements)}
                        </span>
                    </p>
                );
            }

            return (
                <p
                    key={index}
                    className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words text-gray-800"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    {renderInlineText(block.content)}
                </p>
            );

        case 'list':
            if (!block.items || block.items.length === 0) return null;

            const ListTag = block.listType === 'ordered' ? 'ol' : 'ul';
            const listClass = block.listType === 'ordered'
                ? "list-decimal list-inside space-y-2 mb-3 sm:mb-4 ml-2"
                : "list-disc list-inside space-y-2 mb-3 sm:mb-4 ml-2";

            return (
                <ListTag
                    key={index}
                    className={listClass}
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    {block.items.map((itemContent, i) => (
                        <li key={i} className="text-sm sm:text-base leading-relaxed text-gray-800">
                            {renderInlineText(itemContent)}
                        </li>
                    ))}
                </ListTag>
            );

        default:
            return null;
    }
}

function renderInlineText(elements: RichTextElement[]): React.ReactNode {
    return elements.map((el, i) => {
        const text = el.plain_text;
        const annotations = el.annotations;

        // Skip empty text
        if (!text) return null;

        // Build the element with appropriate formatting
        let content: React.ReactNode = text;

        // Apply formatting in order: bold, italic, code
        if (annotations.code) {
            content = <code key={i} className="bg-gray-100 px-1 rounded">{content}</code>;
        }

        if (annotations.italic) {
            content = <em key={i} className="italic">{content}</em>;
        }

        if (annotations.bold) {
            content = <strong key={i} className="font-semibold">{content}</strong>;
        }

        if (annotations.underline) {
            content = <u key={i}>{content}</u>;
        }

        if (annotations.strikethrough) {
            content = <s key={i}>{content}</s>;
        }

        // Handle links
        if (el.text.link) {
            content = (
                <a
                    key={i}
                    href={el.text.link.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {content}
                </a>
            );
        }

        return <React.Fragment key={i}>{content}</React.Fragment>;
    });
}
