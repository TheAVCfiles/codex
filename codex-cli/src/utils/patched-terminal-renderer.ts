import type { TerminalRendererOptions } from "marked-terminal";

import TerminalRenderer from "marked-terminal";

type TerminalRendererParser = {
  parse: (tokens: unknown, loose?: boolean) => string;
  parseInline: (tokens: unknown) => string;
};

type TerminalRendererInternals = TerminalRenderer & {
  parser: TerminalRendererParser;
  transform: (value: string) => string;
  checkbox: (checked: unknown) => string;
  o: TerminalRendererOptions & {
    listitem: (value: string) => string;
    text: (value: string) => string;
  };
};

const BULLET_POINT_MARKER = "* ";

function toString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return "";
  }
  return String(value);
}

function applyListItemTransforms(
  renderer: TerminalRendererInternals,
  value: string,
): string {
  const transformed = renderer.transform(value);
  return renderer.o.listitem(transformed);
}

function createTextPatch() {
  return function patchedText(this: TerminalRendererInternals, rawValue: unknown) {
    let nextValue = rawValue;
    if (typeof nextValue === "object" && nextValue != null) {
      const token = nextValue as { text?: string; tokens?: unknown };
      if (token.tokens) {
        return this.parser.parseInline(token.tokens);
      }
      nextValue = token.text;
    }
    return this.o.text(toString(nextValue));
  };
}

function createListItemPatch() {
  return function patchedListItem(
    this: TerminalRendererInternals,
    tokenOrText: unknown,
  ) {
    let text = "";

    if (typeof tokenOrText === "object" && tokenOrText != null) {
      const item = tokenOrText as {
        task?: boolean;
        checked?: boolean;
        loose?: boolean;
        tokens: Array<
          | { type: "paragraph"; text: string; tokens?: Array<{ type: string; text: string }> }
          | { type: string; raw?: string; text?: string }
        >;
      };

      if (item.task) {
        const checkbox = this.checkbox({ checked: !!item.checked });
        if (item.loose) {
          if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
            item.tokens[0].text = `${checkbox} ${item.tokens[0].text}`;
            if (
              item.tokens[0].tokens &&
              item.tokens[0].tokens.length > 0 &&
              item.tokens[0].tokens[0].type === "text"
            ) {
              item.tokens[0].tokens[0].text = `${checkbox} ${item.tokens[0].tokens[0].text}`;
            }
          } else {
            item.tokens.unshift({
              type: "text",
              raw: `${checkbox} `,
              text: `${checkbox} `,
            });
          }
        } else {
          text += `${checkbox} `;
        }
      }

      text += this.parser.parse(item.tokens, !!item.loose);
    } else {
      text = toString(tokenOrText);
    }

    const isNested = text.includes("\n");
    const finalText = isNested ? text : applyListItemTransforms(this, text);

    return `\n${BULLET_POINT_MARKER}${finalText}`;
  };
}

export function createPatchedTerminalRenderer(
  options: TerminalRendererOptions,
): TerminalRenderer {
  const renderer = new TerminalRenderer(options) as TerminalRendererInternals;

  renderer.text = createTextPatch() as typeof renderer.text;
  renderer.listitem = createListItemPatch() as typeof renderer.listitem;

  return renderer;
}
