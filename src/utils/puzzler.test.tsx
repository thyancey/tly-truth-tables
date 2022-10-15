import { filterUsedHints, generateHintText, getInfluenceType } from './puzzler';
import { AttributeDetail } from '../types';


describe('puzzler utils', () => {
  describe('#generateSingleHint', () => {
    it('should describe match for attribute in same group, use display for order', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0,
          "solutionIdx": 0,
          "id": "0-0-0",
          "aliases": [],
          "descriptors": [],
          "sortComparisons": []
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1,
          "solutionIdx": 0,
          "id": "0-1-1",
          "aliases": [],
          "descriptors": [],
          "sortComparisons": []
        }
      );
      expect(result).toEqual('The monkey is the second.');
    });

    it('should describe mismatch for attribute in other group', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0,
          "solutionIdx": 0,
          "id": "0-0-0",
          "aliases": [],
          "descriptors": [],
          "sortComparisons": []
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1,
          "solutionIdx": 1,
          "id": "1-1-1",
          "aliases": [],
          "descriptors": [],
          "sortComparisons": []
        }
      );
      expect(result).toEqual('The monkey is not the second.');
    });

    it('should handle syntax for comparing things from the same group', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0,
          "solutionIdx": 0,
          "id": "0-0-0",
          "aliases": [],
          "descriptors": [],
          "sortComparisons": []
        },
        {
          "type": "thing",
          "attribute": "occupation",
          "attributeIdx": 1,
          "value": "doctor",
          "valueIdx": 1,
          "solutionIdx": 0,
          "id": "0-1-1",
          "aliases": [],
          "descriptors": [],
          "sortComparisons": []
        }
      );
      expect(result).toEqual('The monkey is a doctor.');
    });
    
  });

  describe('#filterUsedHints', () => {
    it('should filter out previously selected attribute/value', () => {
      const result = filterUsedHints(
        [
          {
            "type": "thing",
            "attribute": "animal",
            "attributeIdx": 0,
            "value": "monkey",
            "valueIdx": 0,
            "solutionIdx": 0,
            "id": "0-0-0",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          },
          {
            "type": "thing",
            "attribute": "occupation",
            "attributeIdx": 1,
            "value": "doctor",
            "valueIdx": 1,
            "solutionIdx": 0,
            "id": "0-1-1",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          }
        ],
        {
          "id": "0-0-0",
          "attributeIdx":0,
          "valueIdx": 0,
          "solutionIdx": 0
        } as AttributeDetail
      );
  
      expect(result.length).toEqual(1);
    });

    it('should filter out attribute-matching entries that have type "order" when reserved has type "order"', () => {
      const result = filterUsedHints(
        [
          {
            "type": "thing",
            "attribute": "animal",
            "attributeIdx": 0,
            "value": "monkey",
            "valueIdx": 0,
            "solutionIdx": 0,
            "id": "0-0-0",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          },
          { // this one has same attribute, and is also of type "order", FILTER IT OUT!
            "type": "order",
            "attribute": "queue",
            "attributeIdx": 1,
            "value": "first",
            "valueIdx": 1,
            "solutionIdx": 0,
            "id": "0-1-1",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          },
          { // this one has a different attribute, so it shouldnt be filtered
            "type": "order",
            "attribute": "birthday",
            "attributeIdx": 2,
            "value": "first",
            "valueIdx": 1,
            "solutionIdx": 0,
            "id": "0-2-1",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          }
        ],
        {
          "id": "2-1-2",
          "type": "order",
          "attributeIdx":1,
          "valueIdx": 2,
          "solutionIdx": 2
        } as AttributeDetail
      );
  
      expect(result.length).toEqual(2);
      expect(result.map(r => r.attribute)).toEqual(['animal', 'birthday']);
    });

    it('should not filter at all if used is empty', () => {
      const result = filterUsedHints(
        [
          {
            "type": "thing",
            "attribute": "animal",
            "attributeIdx": 0,
            "value": "monkey",
            "valueIdx": 0,
            "solutionIdx": 0,
            "id": "0-0-0",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          },
          {
            "type": "thing",
            "attribute": "occupation",
            "attributeIdx": 1,
            "value": "doctor",
            "valueIdx": 1,
            "solutionIdx": 0,
            "id": "0-1-1",
            "aliases": [],
            "descriptors": [],
            "sortComparisons": []
          }
        ]
      );
  
      expect(result.length).toEqual(2);
    });
  });
  describe('#getInfluenceType', () => {
    it('should influence "same" when yeses below threshold', () => {
      expect(getInfluenceType([3, 1], .9)).toEqual('same');
    });
    it('should influence "different" when yeses above threshold', () => {
      expect(getInfluenceType([3, 1], .5)).toEqual('different');
    });

    it('should influence "different" when nos below threshold', () => {
      expect(getInfluenceType([1, 1], .3)).toEqual('different');
    });
    it('should influence "same" when nos above threshold', () => {
      expect(getInfluenceType([1, 4], .3)).toEqual('same');
    });
    it('should influence "same" when influence is 1', () => {
      expect(getInfluenceType([1, 2], 1)).toEqual('same');
    });
    it('should influence "different" when influence is 0', () => {
      expect(getInfluenceType([1, 2], 0)).toEqual('different');
    });
  })
});