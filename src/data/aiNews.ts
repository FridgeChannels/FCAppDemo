// Using mockData; dev team will replace with real API hook useFetchAiNewsAudio() / TTS service.

export interface AiNewsItem {
  id: string;
  title: string;
  summary: string;
}

export interface AiNewsBulletin {
  id: string;
  language: "zh-CN" | "en-US";
  durationSeconds: number;
  headline: string;
  items: AiNewsItem[];
  outro: string;
}

export const mockAiNewsBulletin: AiNewsBulletin = {
  id: "ai-news-001",
  language: "zh-CN",
  durationSeconds: 180,
  headline: "三分钟 AI 新闻速览",
  items: [
    {
      id: "n1",
      title: "多模态助手更轻量",
      summary:
        "越来越多的终端侧模型开始支持图像与语音输入，主打低延迟与隐私保护。重点不只是更大参数，而是更好的推理效率与更稳的交互体验。",
    },
    {
      id: "n2",
      title: "企业开始“AI 成本治理”",
      summary:
        "不少团队把焦点从“能不能用”转向“用得起、用得稳”。常见做法包括：缓存、路由到更便宜模型、限制上下文长度、以及针对场景做评测。",
    },
    {
      id: "n3",
      title: "AI Agent 进入流程化落地",
      summary:
        "Agent 不再只是 Demo。越来越多产品把它嵌入到明确的流程里：信息收集、草拟、审校、提交。关键是可控、可回滚、可观测。",
    },
    {
      id: "n4",
      title: "合规与水印持续推进",
      summary:
        "随着生成内容增多，平台和企业都在强化溯源与版权合规：包含素材许可、训练数据声明、以及对外输出的标识与审核机制。",
    },
  ],
  outro: "以上就是今天的 AI 新闻速览。感谢收听，祝你有高效的一天。",
};

export function buildAiNewsScript(bulletin: AiNewsBulletin): string {
  const lines: string[] = [];
  lines.push(bulletin.headline);
  lines.push("");
  bulletin.items.forEach((item, idx) => {
    lines.push(`第${idx + 1}条：${item.title}。${item.summary}`);
    lines.push("");
  });
  lines.push(bulletin.outro);
  return lines.join("\n");
}


