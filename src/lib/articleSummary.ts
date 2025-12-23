import { ARTICLE_URL, SUMMARY_PROMPT } from "@/data/articleConfig";
import { mockRecommendationSummaryByUrl } from "@/data/articleSummaries";

export interface ArticleSummaryInput {
  url: string;
  prompt: string;
}

/**
 * Mock summarizer.
 * - Today: returns curated mock summary for known URLs.
 * - Future: dev team replaces with server/API call to fetch article + LLM summarize(prompt).
 */
export function getRecommendationSummary({ url, prompt }: ArticleSummaryInput): string {
  // keep "prompt" as an explicit input so wiring doesn't change when replaced with real LLM
  void prompt;

  const summary = mockRecommendationSummaryByUrl[url];
  if (summary) return summary;

  return `我还没有这篇文章的 mock 内容。\n\n链接：${url}\n\n请把文章正文（或抓取结果）接入后，再用 prompt 生成“推荐摘要”。`;
}

export function getDefaultArticleSummary(): string {
  return getRecommendationSummary({ url: ARTICLE_URL, prompt: SUMMARY_PROMPT });
}


