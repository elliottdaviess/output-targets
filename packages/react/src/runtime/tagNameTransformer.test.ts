import { describe, it, expect, beforeEach } from 'vitest';
import { 
  setTagNameTransformer, 
  clearTagNameTransformer, 
  getTagNameTransformer,
  transformTagName,
  type TagNameTransformer 
} from './tagNameTransformer.js';

describe('tagNameTransformer', () => {
  beforeEach(() => {
    // Clear transformer before each test
    clearTagNameTransformer();
  });

  describe('setTagNameTransformer', () => {
    it('should set a global tag name transformer', () => {
      const transformer: TagNameTransformer = (tagName) => `${tagName}-v2`;
      
      setTagNameTransformer(transformer);
      
      expect(getTagNameTransformer()).toBe(transformer);
    });

    it('should replace previous transformer when called multiple times', () => {
      const transformer1: TagNameTransformer = (tagName) => `${tagName}-v1`;
      const transformer2: TagNameTransformer = (tagName) => `${tagName}-v2`;
      
      setTagNameTransformer(transformer1);
      setTagNameTransformer(transformer2);
      
      expect(getTagNameTransformer()).toBe(transformer2);
    });
  });

  describe('clearTagNameTransformer', () => {
    it('should clear the current transformer', () => {
      const transformer: TagNameTransformer = (tagName) => `${tagName}-v2`;
      
      setTagNameTransformer(transformer);
      clearTagNameTransformer();
      
      expect(getTagNameTransformer()).toBeUndefined();
    });
  });

  describe('transformTagName', () => {
    it('should return original tag name when no transformer is set', () => {
      const tagName = 'my-component';
      
      const result = transformTagName(tagName);
      
      expect(result).toBe('my-component');
    });

    it('should apply transformation when transformer is set', () => {
      const transformer: TagNameTransformer = (tagName) => `${tagName}-v2`;
      setTagNameTransformer(transformer);
      
      const result = transformTagName('my-component');
      
      expect(result).toBe('my-component-v2');
    });

    it('should apply version suffix transformation', () => {
      setTagNameTransformer((tagName) => `${tagName}-v2`);
      
      expect(transformTagName('my-button')).toBe('my-button-v2');
      expect(transformTagName('my-tabs')).toBe('my-tabs-v2');
      expect(transformTagName('my-input')).toBe('my-input-v2');
    });

    it('should apply team prefix transformation', () => {
      setTagNameTransformer((tagName) => `alpha-${tagName}`);
      
      expect(transformTagName('my-button')).toBe('alpha-my-button');
      expect(transformTagName('my-tabs')).toBe('alpha-my-tabs');
      expect(transformTagName('my-input')).toBe('alpha-my-input');
    });

    it('should apply complex transformation logic', () => {
      setTagNameTransformer((tagName) => {
        if (tagName.startsWith('my-')) {
          return `admiral-${tagName.substring(3)}-v2`;
        }
        return tagName;
      });
      
      expect(transformTagName('my-button')).toBe('admiral-button-v2');
      expect(transformTagName('my-tabs')).toBe('admiral-tabs-v2');
      expect(transformTagName('other-component')).toBe('other-component');
    });

    it('should handle environment-specific transformations', () => {
      const originalEnv = process.env.NODE_ENV;
      
      try {
        process.env.NODE_ENV = 'development';
        setTagNameTransformer((tagName) => `${tagName}-${process.env.NODE_ENV}`);
        
        expect(transformTagName('my-button')).toBe('my-button-development');
        
        process.env.NODE_ENV = 'production';
        expect(transformTagName('my-button')).toBe('my-button-production');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should handle empty and special tag names', () => {
      setTagNameTransformer((tagName) => `prefix-${tagName}`);
      
      expect(transformTagName('')).toBe('prefix-');
      expect(transformTagName('a')).toBe('prefix-a');
      expect(transformTagName('component-with-many-dashes')).toBe('prefix-component-with-many-dashes');
    });
  });
});
