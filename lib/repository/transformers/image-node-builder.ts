import { ImageNode } from "@/types/ast.types";
import { ImageResolver } from "@/lib/services/image-resolver";

export interface ImageBuilderContext {
  year: string;
  shift: string;
  imagesRequired?: string[];
}

export function buildImageNode(
  token: string,
  context: ImageBuilderContext
): ImageNode {
  // Two-shift papers are "2026-FN"; single-shift papers (e.g. EC) are just "2024".
  const yearShift = context.year
    ? (context.shift ? `${context.year}-${context.shift}` : `${context.year}`)
    : "UNKNOWN_YEAR_SHIFT";

  const resolved = ImageResolver.resolveToken(token, yearShift, context.imagesRequired);

  return {
    type: "image",
    originalToken: token,
    resolvedUrl: resolved.resolvedUrl || "/images/fallbacks/missing-image.png",
    resolvedUrls: resolved.resolvedUrls,
    altText: "Question image",
    hasError: resolved.hasError,
  };
}
