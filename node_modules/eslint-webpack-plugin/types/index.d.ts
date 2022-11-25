export = ESLintWebpackPlugin;
declare class ESLintWebpackPlugin {
  /**
   * @param {Options} options
   */
  constructor(options?: Options);
  key: string;
  options: import('./options').PluginOptions;
  /**
   * @param {Compiler} compiler
   * @param {Omit<Options, 'resourceQueryExclude'> & {resourceQueryExclude: RegExp[]}} options
   * @param {string[]} wanted
   * @param {string[]} exclude
   */
  run(
    compiler: Compiler,
    options: Omit<Options, 'resourceQueryExclude'> & {
      resourceQueryExclude: RegExp[];
    },
    wanted: string[],
    exclude: string[]
  ): Promise<void>;
  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  apply(compiler: Compiler): void;
  /**
   *
   * @param {Compiler} compiler
   * @returns {string}
   */
  getContext(compiler: Compiler): string;
}
declare namespace ESLintWebpackPlugin {
  export { Compiler, Options };
}
type Compiler = import('webpack').Compiler;
type Options = import('./options').Options;
