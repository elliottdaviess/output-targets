/**
 * Global tag name transformer for Stencil React components.
 * Enables runtime transformation of component tag names for microfrontend environments.
 */

export type TagNameTransformer = (tagName: string) => string;

/**
 * Global tag name transformer instance.
 * Set this using setTagNameTransformer() to transform all component tag names at runtime.
 */
let globalTagNameTransformer: TagNameTransformer | undefined;

/**
 * Sets the global tag name transformer function.
 * This will affect all Stencil React components created after this call.
 * 
 * @param transformer - Function that takes original tag name and returns transformed tag name
 * 
 * @example
 * ```ts
 * // Add version suffix to all components
 * setTagNameTransformer((tagName) => `${tagName}-v2`);
 * 
 * // Add team prefix  
 * setTagNameTransformer((tagName) => `alpha-${tagName}`);
 * 
 * // Environment-specific transformation
 * setTagNameTransformer((tagName) => `${tagName}-${process.env.NODE_ENV}`);
 * ```
 */
export const setTagNameTransformer = (transformer: TagNameTransformer): void => {
  globalTagNameTransformer = transformer;
};

/**
 * Gets the currently active tag name transformer.
 * Used internally by the React output target.
 * 
 * @internal
 */
export const getTagNameTransformer = (): TagNameTransformer | undefined => {
  return globalTagNameTransformer;
};

/**
 * Clears the global tag name transformer.
 * Useful for testing or resetting transformation state.
 */
export const clearTagNameTransformer = (): void => {
  globalTagNameTransformer = undefined;
};

/**
 * Applies the current tag name transformer if one is set.
 * Returns the original tag name if no transformer is active.
 * 
 * @param tagName - Original tag name
 * @returns Transformed tag name or original if no transformer set
 * 
 * @internal
 */
export const transformTagName = (tagName: string): string => {
  return globalTagNameTransformer ? globalTagNameTransformer(tagName) : tagName;
};
