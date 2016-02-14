var td = require('../lib/tree-doctor')
var util = require('util')

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

describe('growObjects()', function() {
    it('should grow a single level of object hierarchy with default parameters', function() {
        var flat = {
            'normal_field' : 'Just a field',
            'numeric' : 123.25,
            'date' : new Date(),
            'sub:field' : 'Just a string',
            'sub:date' : new Date()
        }
        expect(td.growObjects(flat)).toEqual({
            'normal_field' : 'Just a field',
            'numeric' : 123.25,
            'date' : flat['date'],
            'sub' : {
                'field' : 'Just a string',
                'date' : flat['sub:date']
            }            
        })
    })
    
    it('should grow multi-level objects with default parameters', function() {
        var flat = {
            'field' : 'Just a field',
            'date' : new Date(),
            'sub:object:field' : new Date(),
            'sub:object:object' : { 'field' : 'value' },
            'sub:field' : 'value',
            'sub2:field' : new Date()
        }
        expect(td.growObjects(flat)).toEqual({
            'field' : 'Just a field',
            'date' : flat['date'],
            'sub' : {
                'object' : {
                    'field' : flat['sub:object:field'],
                    'object' : { 'field' : 'value' }
                },
                'field' : 'value'
            },
            'sub2' : {
                'field' : flat['sub2:field']
            }            
        })
    })
})