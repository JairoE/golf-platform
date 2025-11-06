export interface HtmlNodeJson {
  type: string;
  attributes?: Record<string, string>;
  children?: HtmlNodeJson[];
  text?: string;
}

const nodeToJson = (node: ChildNode): HtmlNodeJson | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? "";
    return text ? {type: "text", text} : null;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const attributes: Record<string, string> = {};

    Array.from(element.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });

    const children = Array.from(element.childNodes)
      .map(nodeToJson)
      .filter((child): child is HtmlNodeJson => child !== null);

    return {
      type: element.tagName.toLowerCase(),
      attributes: Object.keys(attributes).length ? attributes : undefined,
      children: children.length ? children : undefined,
      text: element.childElementCount === 0
        ? element.textContent?.trim() || undefined
        : undefined,
    };
  }

  return null;
};

export const htmlStringToJson = (html: string): HtmlNodeJson[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return Array.from(doc.body.childNodes)
    .map(nodeToJson)
    .filter((node): node is HtmlNodeJson => node !== null);
};

