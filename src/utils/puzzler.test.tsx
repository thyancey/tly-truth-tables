import { filterUsedHints, generateSingleHint, generateHintText } from './puzzler';
import { AttributeDetail } from '../types';


describe('puzzler utils', () => {
  describe('#generateSingleHint', () => {
    it('should describe match for attribute in same group', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0,
          "solutionIdx": 0
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1,
          "solutionIdx": 0
        }
      );
      expect(result).toEqual('The monkey is the second one.');
    });

    it('should describe mismatch for attribute in other group', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0,
          "solutionIdx": 0
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1,
          "solutionIdx": 1
        }
      );
      expect(result).toEqual('The monkey is not the second one.');
    });

    it('should handle syntax for comparing things from the same group', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0,
          "solutionIdx": 0
        },
        {
          "type": "thing",
          "attribute": "occupation",
          "attributeIdx": 1,
          "value": "doctor",
          "valueIdx": 1,
          "solutionIdx": 0
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
            "solutionIdx": 0
          },
          {
            "type": "thing",
            "attribute": "occupation",
            "attributeIdx": 1,
            "value": "doctor",
            "valueIdx": 1,
            "solutionIdx": 0
          }
        ],
        [
          {
            "attributeIdx":0, "valueIdx": 0, "solutionIdx": 0
          } as AttributeDetail
        ]
      );
  
      expect(result.length).toEqual(1);
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
            "solutionIdx": 0
          },
          {
            "type": "thing",
            "attribute": "occupation",
            "attributeIdx": 1,
            "value": "doctor",
            "valueIdx": 1,
            "solutionIdx": 0
          }
        ],
        []
      );
  
      expect(result.length).toEqual(2);
    });
  });
});