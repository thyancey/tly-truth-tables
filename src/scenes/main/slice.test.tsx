import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { isCellSolution } from './slice';


describe('board store', () => {
  describe('#isCellSolution', () => {
    it('1x1, invalid col should return false', () => {
      expect(isCellSolution(
        [
          [0,1,2],
          [1,2,0],
          [2,0,1]
        ], [ [0, 0], [1, 0] ]
      )).toEqual(false)
    });

    it('1x1, valid row/col, 2nd col should return true', () => {
      expect(isCellSolution(
        [
          [0,1,2],
          [1,2,0],
          [2,0,1]
        ], [ [0, 0], [1, 1] ]
      )).toEqual(true)
    });

    it('1x1, valid row/col, 3rd col should return true', () => {
      expect(isCellSolution(
        [
          [0,1,2],
          [1,2,0],
          [2,0,1]
        ], [ [0, 0], [2, 2] ]
      )).toEqual(true)
    });

    it('1x1, valid row/col, 2nd row, 3rd col should return true', () => {
      expect(isCellSolution(
        [
          [0,1,2],
          [1,2,0],
          [2,0,1]
        ], [ [1, 2], [2, 0] ]
      )).toEqual(true)
    });
  })
});