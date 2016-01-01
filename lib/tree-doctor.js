'use strict'

var extend = require('util')._extend;

/**
 * Turn an array into a tree
 * 
 * This function turns a flat arrow of tree nodes referenced by identifiers (e.g. as retrieved from a database)
 * into a tree structure of objects.
 * 
 * @param {nodes} The array of tree nodes. Nodes are arbitrary objects containing at least the identifier field described below.
 *                  The array *MUST* contain all nodes referenced in the in a tree.
 *                  The array *MAY* contain multiple roots (i.e. nodes without a parent).
 * @param {id} The name of the identifier field. The function assumes that the nodes in the tree are
 *                  referenced using a unique identifier field (e.g. a primary key in a database). This
 *                  parameter gives the name of said field. Each node *MUST* have an identifiert field.
 * @param {reference} The name of the reference field. If a node contains a parent reference to another node
 *                  it will be stored as a child of said node. The function expects the reference field to 
 *                  contain the identifier of the parent node.
 * @param {children} The name of the children array of a node. When growing the tree the function will store the
 *                  found children in the field named by this parameter.
 * 
 * @return An array of all the roots contained in the input (i.e. all nodes without a parent reference). The function
 *          copies its input objects and leave them untouched.
 */
function grow(nodes, id, reference, children)
{
    var elements = {};
    // save all elements
    
    for (let node_id in nodes) {
        let node = nodes[node_id];
        elements[node[id]] = extend({},node);
    }
    // insert children into nodes
    for (let node_id in elements) {
        let node = elements[node_id];
        if (node[reference]) {
            if (!(node[reference] in elements)) {
                // there is a node reference which doesn't exist -> error
                throw Error("Unknown parent node "+node[reference]);
            }
            if (!(children in elements[node[reference]])) {
                elements[node[reference]][children] = [];
            }
            elements[node[reference]][children].push(node);
        }
    }
    // gather all roots
    var ret = [];
    for (let node_id in elements) {
        let node = elements[node_id];
        if (!reference in node || !node[reference]) {
            ret.push(node);
        }
    }
    return ret;
}

/**
 * Flatten an arbitrary tree structure into an array.
 * 
 * This function flattens a tree structure into an array defining references between nodes
 * by storing parent identifiers (i.e. it creates a structure which could very well be stored in a
 * relational database).
 * 
 * @param {roots} An array of tree roots to flatten into an array. All roots will be flattened into the same output.
 * @param {id} The name of the identifier field of the tree nodes. When storing nodes in the output
 *              the function will use the value of this field to reference parents of nodes. The value of this
 *              field *MUST* be unique over all elements in the input.
 * @param {reference} The name of the reference field. This is the name of the field in the output object where this
 *              function will store the identifier of a node's parent (if any).
 * @param {children} The name of the children field in a tree node. The function assumes, that a node contains
 *              its children in an array. This parameter names the relevant array.
 * @return An array of node objects without the array named by the {children}-parameter, but containing the
 *              reference to their parent nodes as value of the field named by {reference}.
 */
function flatten(roots, id, reference, children)
{
    var ret = [];

    var rec_flat = function(root) {
        let r = extend({}, root);
        ret.push(r);
        if (children in r) {
            for (let c_index in r[children]) {
                rec_flat(r[children][c_index]);
            }
            delete r[children];
        }
    };
    
    for (let index in roots) {
        let root = roots[index];
        rec_flat(root);
    }
    return ret;
}

module.exports = {
    grow : grow,
    flatten : flatten 
}