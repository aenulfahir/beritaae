"use client";

import { AdBanner } from "./AdBanner";
import { cn } from "@/lib/utils";

interface InArticleAdProps {
  className?: string;
}

export function InArticleAd({ className }: InArticleAdProps) {
  return (
    <div className={cn("my-8 flex flex-col items-center", className)}>
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
        Advertisement
      </p>
      <AdBanner
        slotType="in_article"
        width={300}
        height={250}
        className="max-w-full"
      />
    </div>
  );
}

// Helper function to insert ad after 3rd paragraph in HTML content
export function insertAdInContent(
  htmlContent: string,
  adPlaceholder: string = "<!-- AD_PLACEHOLDER -->"
): string {
  // Split content by paragraph tags
  const paragraphRegex = /<\/p>/gi;
  const parts = htmlContent.split(paragraphRegex);

  // If less than 3 paragraphs, add at the end
  if (parts.length < 3) {
    return htmlContent + adPlaceholder;
  }

  // Insert after 3rd paragraph (index 2, since we split on </p>)
  const result =
    parts.slice(0, 3).join("</p>") +
    "</p>" +
    adPlaceholder +
    parts.slice(3).join("</p>");

  return result;
}

// Component that wraps article content and inserts ad
interface ArticleContentWithAdProps {
  content: string;
  className?: string;
}

export function ArticleContentWithAd({
  content,
  className,
}: ArticleContentWithAdProps) {
  // Count paragraphs
  const paragraphCount = (content.match(/<\/p>/gi) || []).length;

  // If less than 3 paragraphs, show ad at end
  if (paragraphCount < 3) {
    return (
      <div className={className}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <InArticleAd />
      </div>
    );
  }

  // Split and insert ad after 3rd paragraph
  const paragraphRegex = /<\/p>/gi;
  let count = 0;
  let insertIndex = 0;
  let match;

  while ((match = paragraphRegex.exec(content)) !== null) {
    count++;
    if (count === 3) {
      insertIndex = match.index + match[0].length;
      break;
    }
  }

  const beforeAd = content.slice(0, insertIndex);
  const afterAd = content.slice(insertIndex);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: beforeAd }} />
      <InArticleAd />
      <div dangerouslySetInnerHTML={{ __html: afterAd }} />
    </div>
  );
}
