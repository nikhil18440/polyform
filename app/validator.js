// schemas/validator.js

const allowedTypes = new Set([
  "Form",
  "TextField",
  "Button",
  "Dropdown",
  // Add more components here
]);

function validateNode(node, path = 'root') {
  if (!node || typeof node !== 'object') {
    throw new Error(`Invalid node at ${path}: must be an object`);
  }

  if (!node.type || typeof node.type !== 'string') {
    throw new Error(`Missing or invalid "type" at ${path}`);
  }

  if (!allowedTypes.has(node.type)) {
    throw new Error(`Unknown component type "${node.type}" at ${path}`);
  }

  if (!node.props || typeof node.props !== 'object') {
    throw new Error(`Missing or invalid "props" for ${node.type} at ${path}`);
  }

  if (node.children) {
    if (!Array.isArray(node.children)) {
      throw new Error(`"children" must be an array at ${path}`);
    }

    node.children.forEach((child, index) => {
      validateNode(child, `${path} > ${node.type}[${index}]`);
    });
  }

  return true
}

export function validateSchema(schema) {
  return validateNode(schema);
}
