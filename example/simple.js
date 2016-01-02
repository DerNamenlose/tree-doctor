var td = require('../lib/tree-doctor');
var util = require('util');

var trees = [
    { 
        id : 1,
        title : 'A root node',
        children : [
            {
                id : 2,
                title : 'A child'
            },
            {
                id : 3,
                title : 'Another child',
                children : [
                    {
                        id : 4,
                        title : 'A leaf'
                    }
                ]
            }
        ]
    }
];

var flat = td.flatten(trees, 'id', 'parent', 'children');
console.log('Flat: ',flat);

var restored = td.grow(flat, 'id', 'parent', 'children');
console.log('Tree: ', util.inspect(restored, false, 10));
