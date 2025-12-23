// Using mockData; dev team will replace with real LLM output from SUMMARY_PROMPT.
import { ARTICLE_URL } from "./articleConfig";
import recapTextZhCN from "./recapText.zh-CN.txt?raw";

export type ArticleSummaryByUrl = Record<string, string>;

/**
 * Mock summary generated from the provided article snippet (Dec 09, 2025).
 * Source: ARTICLE_URL
 */
export const mockRecommendationSummaryByUrl: ArticleSummaryByUrl = {
  [ARTICLE_URL]: recapTextZhCN.trim(),
};


