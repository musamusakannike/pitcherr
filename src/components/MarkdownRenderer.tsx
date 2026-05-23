"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * A lightweight, fast Markdown parser component designed to render
 * AI proposal and project outlines into semantic, premium styled HTML.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split("\n");
  const parsedElements: React.ReactNode[] = [];

  let inList = false;
  let listItems: string[] = [];

  const renderTextWithFormatting = (text: string) => {
    // Escape standard regex characters
    let parts: React.ReactNode[] = [text];

    // Parse Bold: **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let hasBold = text.match(boldRegex);

    if (hasBold) {
      const splitParts = text.split(/\*\*(.*?)\*\*/g);
      parts = splitParts.map((part, index) => {
        // Even indices are plain text, odd indices are bold text
        if (index % 2 === 1) {
          return <strong key={index} className="font-semibold text-ink">{part}</strong>;
        }
        return part;
      });
    }

    // A secondary level: Parse Italic (*text* or _text_)
    // Let's keep it simple, but robust
    return parts;
  };

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      const items = [...listItems];
      listItems = [];
      inList = false;
      return (
        <ul key={`ul-${key}`} className="list-disc pl-6 mb-4 space-y-1.5 text-text-dark font-sans leading-relaxed">
          {items.map((item, i) => (
            <li key={i}>{renderTextWithFormatting(item)}</li>
          ))}
        </ul>
      );
    }
    return null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (line === "") {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      continue;
    }

    // Check for Headers
    if (line.startsWith("# ")) {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      parsedElements.push(
        <h1 key={i} className="text-3xl font-bold font-display text-ink mt-6 mb-3 tracking-tight">
          {renderTextWithFormatting(line.substring(2))}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      parsedElements.push(
        <h2 key={i} className="text-2xl font-bold font-display text-ink mt-5 mb-2.5 tracking-tight">
          {renderTextWithFormatting(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      parsedElements.push(
        <h3 key={i} className="text-xl font-semibold font-display text-ink mt-4 mb-2 tracking-tight">
          {renderTextWithFormatting(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith("#### ")) {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      parsedElements.push(
        <h4 key={i} className="text-lg font-semibold font-display text-ink mt-3.5 mb-1.5 tracking-tight">
          {renderTextWithFormatting(line.substring(5))}
        </h4>
      );
    }
    // Check for bullet lists
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listItems.push(line.substring(2));
    }
    // Check for blockquotes
    else if (line.startsWith("> ")) {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      parsedElements.push(
        <blockquote key={i} className="border-l-4 border-secondary/50 pl-4 py-1.5 my-4 italic text-zinc-600 bg-secondary/5 rounded-r">
          {renderTextWithFormatting(line.substring(2))}
        </blockquote>
      );
    }
    // Default: paragraph
    else {
      if (inList) {
        const listNode = flushList(i);
        if (listNode) parsedElements.push(listNode);
      }
      parsedElements.push(
        <p key={i} className="mb-4 text-text-dark font-sans leading-relaxed text-sm md:text-base">
          {renderTextWithFormatting(line)}
        </p>
      );
    }
  }

  // Flush any remaining list items at the end
  if (inList && listItems.length > 0) {
    const listNode = flushList(lines.length);
    if (listNode) parsedElements.push(listNode);
  }

  return <div className="prose prose-zinc max-w-none">{parsedElements}</div>;
}
export default MarkdownRenderer;
