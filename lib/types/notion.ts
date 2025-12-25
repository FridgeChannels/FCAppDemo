// TypeScript types for Notion Newsletter data

export interface RichTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface RichTextElement {
  type: string;
  text: {
    content: string;
    link: { url: string } | null;
  };
  annotations: RichTextAnnotations;
  plain_text: string;
  href: string | null;
}

export interface NotionNewsletter {
  id: string;
  properties: {
    'Magnet 模板键': {
      title: Array<{ plain_text: string }>;
    };
    'Newsletter 标题': {
      rich_text: Array<{ plain_text: string }>;
    };
    '作者': {
      rich_text: Array<{ plain_text: string }>;
    };
    'Newsletter 内容': {
      rich_text: RichTextElement[];
    };
    '时间': {
      rich_text: Array<{ plain_text: string }>;
    };
    '年订阅费用': {
      rich_text: Array<{ plain_text: string }>;
    };
    '月订阅费用': {
      rich_text: Array<{ plain_text: string }>;
    };
    'CTA 文案': {
      rich_text: Array<{ plain_text: string }>;
    };
    "You will get": {
      rich_text: Array<{ plain_text: string }>;
    };
    'consume': {
      rich_text: Array<{ plain_text: string }>;
    };
    'TTS 语音'?: {
      url?: string;
      rich_text?: Array<{ plain_text: string }>;
    };
  };
}

export interface NewsletterData {
  id: string;
  templateKey: string;
  title: string;
  author: string;
  content: string; // Plain text for backward compatibility
  contentRichText: RichTextElement[]; // Structured rich text with formatting
  time: string;
  annualPrice: string;
  monthlyPrice: string;
  ctaText: string;
  benefits: string[];
  consume: string;
  ttsUrl?: string;
  benefitsPrompt?: string;
  consumePrompt?: string;
}
