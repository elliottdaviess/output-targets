import type { EventName, Options } from '@lit/react';
import { createComponent as createComponentWrapper } from '@lit/react';

import { transformTagName } from './tagNameTransformer.js';

// A key value map matching React prop names to event names.
type EventNames = Record<string, EventName | string>;

// Type that's compatible with both React 18 and 19
type StencilProps<I extends HTMLElement, E extends EventNames> = Omit<React.HTMLAttributes<I>, keyof E> &
  Partial<{ [K in keyof E]: E[K] extends EventName<infer T> ? (event: T) => void : (event: any) => void }> &
  Partial<Omit<I, keyof HTMLElement>> &
  React.RefAttributes<I>;

export type StencilReactComponent<I extends HTMLElement, E extends EventNames = {}> = React.FunctionComponent<
  StencilProps<I, E>
>;

/**
 * Defines a custom element and creates a React component.
 * @public
 */
export const createComponent = <I extends HTMLElement, E extends EventNames = {}>({
  defineCustomElement,
  ...options
}: Options<I, E> & { defineCustomElement: () => void }): StencilReactComponent<I, E> => {
  if (typeof defineCustomElement !== 'undefined') {
    defineCustomElement();
  }

  // Apply tag name transformation if a transformer is set
  const originalTagName = options.tagName;
  const transformedTagName = transformTagName(originalTagName);

  // Debug logging
  if (originalTagName !== transformedTagName) {
    console.log(`🔧 Transforming: ${originalTagName} → ${transformedTagName}`);
  }

  const transformedOptions = {
    ...options,
    tagName: transformedTagName,
  };

  return createComponentWrapper<I, E>(transformedOptions) as unknown as StencilReactComponent<I, E>;
};
