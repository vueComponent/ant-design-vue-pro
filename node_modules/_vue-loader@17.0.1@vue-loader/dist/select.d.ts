/// <reference types="node" />
import webpack = require('webpack');
import type { SFCDescriptor } from 'vue/compiler-sfc';
import type { ParsedUrlQuery } from 'querystring';
import type { VueLoaderOptions } from 'src';
export declare function selectBlock(descriptor: SFCDescriptor, scopeId: string, options: VueLoaderOptions, loaderContext: webpack.loader.LoaderContext, query: ParsedUrlQuery, appendExtension: boolean): void;
