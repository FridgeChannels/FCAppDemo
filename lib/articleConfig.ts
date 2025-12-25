// Using mockData; dev team will replace with real article fetch + LLM summarize pipeline.

export const ARTICLE_URL = "https://www.lennysnewsletter.com/p/how-to-spot-a-top-1-startup-early";

export const SUMMARY_PROMPT = `你是一位优秀的内容编辑，擅长把一篇文章浓缩成**让普通读者产生兴趣的推荐摘要**。

输入：一个文章链接（URL）
输出：一段"看完就想点开原文"的摘要，而不是全文压缩。

核心原则：
- 目的不是复述，而是告诉读者：这篇文章为什么值得你花时间
- 不剧透全部结论，保留关键信息空白
- 语言给普通读者，不假设专业背景

输出要求：
- 一句话开头：用问题、反差或具体场景开头（≤1句）
- 正文摘要（3–5句）：说明在讨论什么；点出1–2个最有吸引力的观点或例子；明确读完你会得到什么
- 结尾留钩子：用一句话留下悬念或开放问题，引导继续阅读

输入链接：
{ARTICLE_URL}
`;

