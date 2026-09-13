import type { AnalyzeContext, CollectedItem } from "./types.js";

export function analyzeCrossFileDuplicates(
  context: AnalyzeContext,
  makeMessage: (display: string) => string,
): void {
  const groups = new Map<string, CollectedItem[]>();

  for (const item of context.items) {
    const groupKey = `${item.scope}:::${item.languageId}:::${item.key}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(item);
  }

  for (const items of groups.values()) {
    if (items.length < 2) continue;
    context.report({
      message: makeMessage(items[0].display),
      locations: items.map((item) => ({
        filePath: item.filePath,
        line: item.line,
        column: item.column,
      })),
    });
  }
}
