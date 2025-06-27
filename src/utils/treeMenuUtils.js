/**
 * Tree navigation utilities for device mapping
 */

/**
 * Generic function to traverse tree nodes with a custom predicate
 * @param {Array} nodes - Array of tree nodes
 * @param {Function} predicate - Function that takes a node and returns true if the node matches the criteria
 * @param {Function} resultMapper - Function that transforms a matching node into the desired result format
 * @returns {*} The result of the first matching node, or null/empty result if not found
 */
function traverseTree(nodes, predicate, resultMapper) {
  if (!nodes || !Array.isArray(nodes)) {
    return resultMapper ? resultMapper(null) : null
  }

  for (const node of nodes) {
    if (!node.children) {
      if (predicate(node)) {
        return resultMapper ? resultMapper(node) : node
      }
    } else if (node.children) {
      const result = traverseTree(node.children, predicate, resultMapper)
      if (result !== null && result !== undefined) {
        return result
      }
    }
  }

  return resultMapper ? resultMapper(null) : null
}

/**
 * Find the first leaf node in a tree structure
 * @param {Array} nodes - Array of tree nodes
 * @returns {Object} Object containing id and name of the first leaf, or null values if not found
 */
export function findFirstLeafId(nodes) {
  return traverseTree(
    nodes,
    () => true, // Always true for first leaf
    (node) => (node ? { id: node.deviceSerial, name: node.name } : { id: null, name: null }),
  )
}

/**
 * Find a specific device node by deviceSerial in a tree structure
 * @param {Array} nodes - Array of tree nodes
 * @param {string} deviceSerial - The device serial to search for
 * @returns {Object|null} The found device node or null if not found
 */
export function findDeviceInTree(nodes, deviceSerial) {
  return traverseTree(
    nodes,
    (node) => node.deviceSerial === deviceSerial,
    (node) => node,
  )
}

/**
 * Get all leaf nodes from a tree structure
 * @param {Array} nodes - Array of tree nodes
 * @returns {Array} Array of all leaf nodes
 */
export function getAllLeafNodes(nodes) {
  if (!nodes || !Array.isArray(nodes)) return []

  const leaves = []

  for (const node of nodes) {
    if (!node.children) {
      leaves.push(node)
    } else if (node.children) {
      leaves.push(...getAllLeafNodes(node.children))
    }
  }

  return leaves
}
