import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { createComponent } from './create-component';
import { setTagNameTransformer, clearTagNameTransformer } from './tagNameTransformer';

// Mock @lit/react
vi.mock('@lit/react', () => ({
  createComponent: vi.fn((options) => {
    // Return a mock React component that we can inspect
    const MockComponent = () => React.createElement('div', { 'data-tagname': options.tagName });
    MockComponent.displayName = `MockComponent(${options.tagName})`;
    return MockComponent;
  }),
}));

describe('createComponent', () => {
  beforeEach(() => {
    clearTagNameTransformer();
    vi.clearAllMocks();
  });

  it('should call defineCustomElement if it is defined', () => {
    const defineCustomElement = vi.fn();

    createComponent({
      defineCustomElement,
      tagName: 'my-component',
      elementClass: class Foo {} as any,
      react: React,
      events: {},
      displayName: 'MyComponent',
    });

    expect(defineCustomElement).toHaveBeenCalled();
  });

  it('should use original tag name when no transformer is set', () => {
    const { createComponent: mockCreateComponent } = require('@lit/react');
    
    createComponent({
      defineCustomElement: vi.fn(),
      tagName: 'my-component',
      elementClass: class Foo {} as any,
      react: React,
      events: {},
      displayName: 'MyComponent',
    });

    expect(mockCreateComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        tagName: 'my-component',
      })
    );
  });

  it('should transform tag name when transformer is set', () => {
    const { createComponent: mockCreateComponent } = require('@lit/react');
    
    setTagNameTransformer((tagName) => `${tagName}-v2`);
    
    createComponent({
      defineCustomElement: vi.fn(),
      tagName: 'my-component',
      elementClass: class Foo {} as any,
      react: React,
      events: {},
      displayName: 'MyComponent',
    });

    expect(mockCreateComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        tagName: 'my-component-v2',
      })
    );
  });

  it('should apply team prefix transformation', () => {
    const { createComponent: mockCreateComponent } = require('@lit/react');
    
    setTagNameTransformer((tagName) => `alpha-${tagName}`);
    
    createComponent({
      defineCustomElement: vi.fn(),
      tagName: 'my-button',
      elementClass: class Foo {} as any,
      react: React,
      events: {},
      displayName: 'MyButton',
    });

    expect(mockCreateComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        tagName: 'alpha-my-button',
      })
    );
  });

  it('should preserve all other options while transforming tag name', () => {
    const { createComponent: mockCreateComponent } = require('@lit/react');
    const defineCustomElement = vi.fn();
    const elementClass = class TestElement {} as any;
    const events = { onClick: 'click' };
    
    setTagNameTransformer((tagName) => `${tagName}-transformed`);
    
    createComponent({
      defineCustomElement,
      tagName: 'my-component',
      elementClass,
      react: React,
      events,
      displayName: 'MyComponent',
    });

    expect(mockCreateComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        tagName: 'my-component-transformed',
        elementClass,
        react: React,
        events,
        displayName: 'MyComponent',
      })
    );
  });
});
