// schemas/reactRenderer.js

function renderProps(props) {
  const entries = Object.entries(props || {});
  if (entries.length === 0) return '';
  return entries
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return `${key}={${value}}`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(' ');
}

function renderReactNode(node, indentLevel = 0) {
  const { type, props, children } = node;
  const propsString = renderProps(props);

  const indent = '  '.repeat(indentLevel);
  const innerIndent = '  '.repeat(indentLevel + 1);

  const openingTag = propsString ? `<${type} ${propsString}>` : `<${type}>`;
  const selfClosingTag = propsString ? `<${type} ${propsString} />` : `<${type} />`;

  if (!children || children.length === 0) {
    return `${indent}${selfClosingTag}`;
  }

  const childrenRendered = children
    .map(child => renderReactNode(child, indentLevel + 1))
    .join('\n');

  return `${indent}${openingTag}
${childrenRendered}
${indent}</${type}>`;
}

export function renderReact(schema) {
  return renderReactNode(schema).trim();
}
