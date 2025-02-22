import TurndownService from "turndown";
import { extractFromHtml } from "@extractus/article-extractor";
import * as cheerio from "cheerio";

// Define the structure for markdown conversion results
export interface MarkdownResult {
  title: string;            // Article title
  url: string;              // Source URL
  markdown: string;         // Raw markdown content
  formattedContent: string; // Formatted markdown with title and source
  html: string;             // Raw HTML content
}

/**
 * Creates a configured TurndownService instance with custom markdown conversion rules.
 * @returns Configured TurndownService instance.
 */
const createTurndownService = (): TurndownService => {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  // Custom rule for code blocks and inline code
  turndown.addRule("code", {
    filter: ["pre", "code"],
    replacement: (content, node) => {
      const isCodeBlock = (node as HTMLElement).tagName.toLowerCase() === "pre";
      const cleanContent = content.trim().replace(/^`+|`+$/g, "").trim();
      return isCodeBlock
        ? `\n\`\`\`\n${cleanContent}\n\`\`\`\n`
        : `\`${cleanContent}\``;
    },
  });

  // Custom rule for headings - removes anchor links and brackets
  turndown.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content, node) => {
      const cleanContent = content.replace(/\[.*?\]/g, "").replace(/\(#.*?\)/g, "").trim();
      const level = parseInt((node as HTMLElement).tagName[1]);
      return `\n${"#".repeat(level)} ${cleanContent}\n\n`;
    },
  });

  return turndown;
};

/**
 * Converts HTML to Markdown while extracting article metadata.
 * Checks the HTML content size and truncates it if necessary to avoid memory issues.
 * @param html - The HTML content to convert.
 * @param fallbackMarkdown - Fallback markdown if extraction fails.
 * @returns MarkdownResult containing metadata and converted content.
 */
const extractAndConvertToMarkdown = async (
  html: string,
  fallbackMarkdown: string
): Promise<MarkdownResult> => {
  let result: MarkdownResult = {
    title: "",
    url: "",
    markdown: fallbackMarkdown,
    formattedContent: fallbackMarkdown,
    html: html,
  };

  try {
    const MAX_HTML_SIZE = 1_000_000; // 1MB limit in bytes

    // Truncate the HTML if it exceeds the maximum allowed size
    if (Buffer.byteLength(html, "utf8") > MAX_HTML_SIZE) {
      console.warn("HTML content exceeds maximum size. Truncating to 5MB.");
      // Convert to a buffer, slice to the allowed size, and convert it back to UTF-8 string.
      const buffer = Buffer.from(html, "utf8");
      html = buffer.toString("utf8", 0, MAX_HTML_SIZE);
    }

    // Load HTML using Cheerio
    const $ = cheerio.load(html, {
      xml: false,
    });

    // Remove unnecessary elements to conserve memory
    $("script, style, iframe, noscript").remove();

    // Extract article metadata from the cleaned HTML
    const article = await extractFromHtml($.html());

    // Free up Cheerio’s memory usage
    $.root().empty();

    const title = article?.title?.slice(0, 500) || "";
    const url = article?.url || "";
    const htmlContent = article?.content || "";

    const turndown = createTurndownService();
    const markdownContent = htmlContent ? turndown.turndown(htmlContent) : fallbackMarkdown;

    result = {
      title,
      url,
      markdown: markdownContent.trim(),
      formattedContent: `# ${title}\n\nSource: ${url}\n\n${markdownContent.trim()}`,
      html: htmlContent,
    };
  } catch (error: unknown) {
    console.error("Error extracting article metadata:", error);
    result.markdown = `Error processing content: ${error}\n\n${fallbackMarkdown}`;
    result.formattedContent = result.markdown;
  }

  return result;
};

export default extractAndConvertToMarkdown;