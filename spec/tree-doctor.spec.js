var td = require('../lib/tree-doctor')

describe('grow()', function() {
    it('grows a tree from an array of linked objects', function() {
        var arr = [
            {
                id : 'parent',
            },
            {
                id : 'child',
                parent : 'parent'
            }
        ];

        expect(td.grow(arr, 'id', 'parent', 'children')).toEqual([
            {
                id : 'parent',
                children : [
                    {
                        id : 'child',
                        parent : 'parent'
                    }
                ]
            }
        ])
    })

    it('fails when an object contains an unknown reference', function() {
        var arr = [
            {
                id : 'test',
                parent : 'unknown'
            }
        ];

        expect(() => td.grow(arr, 'id', 'parent', 'children')).toThrowError(/Unknown parent/);
    })

    it('deletes the reference field if requested', function() {
        var arr = [
            {
                id : 'parent',
            },
            {
                id : 'child',
                parent : 'parent'
            }
        ];

        expect(td.grow(arr, 'id', 'parent', 'children', { remove_reference : true })).toEqual([
            {
                id : 'parent',
                children : [
                    {
                        id : 'child'
                    }
                ]
            }
        ])
    })
})

describe('flatten()', function() {
    it('stores a tree of objects into a flat array with references', function() {
        var object = {
            id : 'parent',
            children : [
                {
                    id : 'child1',
                    children : [
                        {
                            id : 'child2'
                        }
                    ]
                }
            ]
        }

        expect(td.flatten([object], 'id', 'parent', 'children')).toEqual([
            {
                id : 'parent'
            },
            {
                id : 'child1',
                parent : 'parent'
            },
            {
                id : 'child2',
                parent : 'child1'
            }
        ])
    })
})