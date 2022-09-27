import { generateHint, generateHintText } from './puzzler';
import { AttributeDetail } from '../types';


describe('puzzler utils', () => {
  describe('#generateHint', () => {
    const sampleAttributes: AttributeDetail[][] = [
      [
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1
        },
        {
          "type": "modifier",
          "attribute": "emotion",
          "attributeIdx": 2,
          "value": "happy",
          "valueIdx": 0
        },
        {
          "type": "thing",
          "attribute": "occupation",
          "attributeIdx": 3,
          "value": "dentist",
          "valueIdx": 1
        }
      ],
      [
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "frog",
          "valueIdx": 1
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "first",
          "valueIdx": 0
        },
        {
          "type": "modifier",
          "attribute": "emotion",
          "attributeIdx": 2,
          "value": "angry",
          "valueIdx": 1
        },
        {
          "type": "thing",
          "attribute": "occupation",
          "attributeIdx": 3,
          "value": "firefighter",
          "valueIdx": 0
        }
      ],
      [
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "fish",
          "valueIdx": 2
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "last",
          "valueIdx": 2
        },
        {
          "type": "modifier",
          "attribute": "emotion",
          "attributeIdx": 2,
          "value": "sad",
          "valueIdx": 2
        },
        {
          "type": "thing",
          "attribute": "occupation",
          "attributeIdx": 3,
          "value": "clown",
          "valueIdx": 2
        }
      ]
    ];

    it('should describe match for attribute in same group', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1
        },
        true
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
          "valueIdx": 0
        },
        {
          "type": "order",
          "attribute": "queue",
          "attributeIdx": 1,
          "value": "second",
          "valueIdx": 1
        },
        false
      );
      expect(result).toEqual('The monkey is not the second one.');
    });

    it('should handle proper', () => {
      const result = generateHintText(
        {
          "type": "thing",
          "attribute": "animal",
          "attributeIdx": 0,
          "value": "monkey",
          "valueIdx": 0
        },
        {
          "type": "thing",
          "attribute": "occupation",
          "attributeIdx": 1,
          "value": "doctor",
          "valueIdx": 1
        },
        true
      );
      expect(result).toEqual('The monkey is a doctor.');
    });
    
  });
});