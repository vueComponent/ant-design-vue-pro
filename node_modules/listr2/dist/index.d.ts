import { Observable, Subject } from 'rxjs';
import Enquirer from 'enquirer';
import { Readable, Writable } from 'stream';
import { WriteStream } from 'fs';

/** Type of listr internal events. */
declare enum ListrEventType {
    TITLE = "TITLE",
    STATE = "STATE",
    ENABLED = "ENABLED",
    SUBTASK = "SUBTASK",
    DATA = "DATA",
    MESSAGE = "MESSAGE"
}

/** Listr Default Context */
declare type ListrContext = any | undefined;
/**
 * ListrTask.
 *
 * Defines the task, conditions and options to run a specific task in the listr.
 */
interface ListrTask<Ctx = ListrContext, Renderer extends ListrRendererFactory = any> {
    /**
     * Title of the task.
     *
     * Give this task a title if you want to track it by name in the current renderer.
     *
     * Tasks without a title will hide in the default renderer and are useful for running a background instance.
     * On verbose renderer, state changes from these tasks will log as 'Task without a title.'
     */
    title?: string;
    /**
     * The task itself.
     *
     * Task can be a sync or async function, an Observable, or a Stream.
     * Task will be executed, if the certain criteria of the state are met and whenever the time for that specific task has come.
     */
    task: (ctx: Ctx, task: TaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    /**
     * Skip this task depending on the context.
     *
     * The function that has been passed in will be evaluated at the runtime when the task tries to initially run.
     */
    skip?: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean | string>);
    /**
     * Enable a task depending on the context.
     *
     * The function that has been passed in will be evaluated at the initial creation of the Listr class for rendering purposes,
     * as well as re-evaluated when the time for that specific task has come.
     */
    enabled?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>);
    /**
     * Adds the given number of retry attempts to the task if the task fails.
     */
    retry?: number;
    /**
     * Runs a specific event if the current task or any of the subtasks has failed.
     *
     * Mostly useful for rollback purposes for subtasks.
     * But can also be useful whenever a task is failed and some measures have to be taken to ensure the state is not changed.
     */
    rollback?: (ctx: Ctx, task: TaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    /**
     * Set exit on the error option from task-level instead of setting it for all the subtasks.
     */
    exitOnError?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>);
    /**
     * Per task options, that depends on the selected renderer.
     *
     * These options depend on the implementation of the selected renderer. If the selected renderer has no options it will
     * be displayed as never.
     */
    options?: ListrGetRendererTaskOptions<Renderer>;
}
/**
 * Options to set the behavior of this base task.
 */
interface ListrOptions<Ctx = ListrContext> {
    /**
     * To inject a context through this options wrapper. Context can also be defined in run time.
     *
     * @default {}
     */
    ctx?: Ctx;
    /**
     * Concurrency sets how many tasks will be run at the same time in parallel.
     *
     * @default false > Default is to run everything synchronously.
     *
     * `true` will set it to `Infinity`, `false` will set it to synchronous.
     *
     * If you pass in a `number` it will limit it to that number.
     */
    concurrent?: boolean | number;
    /**
     * Determine the default behavior of exiting on errors.
     *
     * @default true > exit on any error coming from the tasks.
     */
    exitOnError?: boolean;
    /**
     * Determine the behavior of exiting after rollback actions.
     *
     * This is independent of exitOnError, since failure of a rollback can be a more critical operation comparing to
     * failing a single task.
     *
     * @default true > exit after rolling back tasks
     */
    exitAfterRollback?: boolean;
    /**
     * Collects errors to `ListrInstance.errors`
     *
     * This can take up a lot of memory, so disabling it can fix out-of-memory errors
     *
     * - 'full' will clone the current context and task in to the error instance
     * - 'minimal' will only collect the error message and the location
     * - false will collect no errors
     *
     * @default 'minimal'
     */
    collectErrors?: false | 'minimal' | 'full';
    /**
     * By default, Listr2 will track SIGINIT signal to update the renderer one last time before completely failing.
     *
     * @default true
     */
    registerSignalListeners?: boolean;
    /**
     * Determine the certain condition required to use the non-TTY renderer.
     *
     * @default null > handled internally
     */
    rendererFallback?: boolean | (() => boolean);
    /**
     * Determine the certain condition required to use the silent renderer.
     *
     * @default null > handled internally
     */
    rendererSilent?: boolean | (() => boolean);
    /**
     * Disabling the color, useful for tests and such.
     *
     * @default false
     */
    disableColor?: boolean;
    /**
     * Inject data directly to TaskWrapper.
     */
    injectWrapper?: {
        enquirer?: Enquirer<object>;
    };
}
/**
 * Task can be set of sync or async function, an Observable or a stream.
 */
declare type ListrTaskResult<Ctx> = string | Promise<any> | Listr<Ctx, ListrRendererValue, any> | Readable | NodeJS.ReadableStream | Observable<any>;
/**
 * Parent class options.
 *
 * Parent class has more options where you can also select the and set renderer and non-tty renderer.
 *
 * Any subtasks will respect those options so they will be stripped of that properties.
 */
declare type ListrBaseClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> = ListrOptions<Ctx> & ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>;
/**
 * Sub class options.
 *
 * Subtasks has reduced set options where the missing ones are explicitly set by the base class.
 */
declare type ListrSubClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue> = ListrOptions<Ctx> & Omit<ListrDefaultRendererOptions<Renderer>, 'renderer'>;
/** The internal communication event. */
declare type ListrEvent = {
    type: Exclude<ListrEventType, 'MESSAGE' | 'DATA'>;
    data?: string | boolean;
} | {
    type: ListrEventType.DATA;
    data: string;
} | {
    type: ListrEventType.MESSAGE;
    data: Task<any, any>['message'];
};
/**
 * Used to match event.type to ListrEvent permutations
 */
declare type ListrEventFromType<T extends ListrEventType, E = ListrEvent> = E extends {
    type: infer U;
} ? T extends U ? E : never : never;

interface BasePromptOptions {
    message: string | (() => string) | (() => Promise<string>);
    initial?: boolean | number | number[] | string | (() => string) | (() => Promise<string>);
    required?: boolean;
    stdin?: NodeJS.ReadStream;
    stdout?: NodeJS.WriteStream;
    header?: string;
    footer?: string;
    skip?: (value: any) => boolean | Promise<boolean>;
    format?: (value: any) => any | Promise<any>;
    result?: (value: any) => any | Promise<any>;
    validate?: (value: any, state: any) => boolean | Promise<boolean> | string | Promise<string> | Promise<string | boolean>;
    onSubmit?: (name: any, value: any, prompt: Enquirer.Prompt) => boolean | Promise<boolean>;
    onCancel?: (name: any, value: any, prompt: Enquirer.Prompt) => boolean | Promise<boolean>;
}
interface BasePromptOptionsWithName extends BasePromptOptions {
    name: string | (() => string);
}
interface ArrayPromptOptions extends BasePromptOptions {
    choices: string[] | BasePromptOptionsWithName[];
    maxChoices?: number;
    multiple?: boolean;
    initial?: number | number[];
    delay?: number;
    separator?: boolean;
    sort?: boolean;
    linebreak?: boolean;
    edgeLength?: number;
    align?: 'left' | 'right';
    scroll?: boolean;
    hint?: string;
}
interface BooleanPromptOptions extends BasePromptOptions {
    initial?: boolean | (() => string) | (() => Promise<string>);
}
interface StringPromptOptions extends BasePromptOptions {
    initial?: string;
    multiline?: boolean;
}
interface ScalePromptOptions extends ArrayPromptOptions {
    scale: StringPromptOptions[];
    margin?: [number, number, number, number];
}
interface NumberPromptOptions extends BasePromptOptions {
    min?: number;
    max?: number;
    delay?: number;
    float?: boolean;
    round?: boolean;
    major?: number;
    minor?: number;
    initial?: number;
}
interface SnippetPromptOptions extends BasePromptOptions {
    newline?: string;
    fields: Partial<BasePromptOptionsWithName>[];
    template: string;
}
interface SortPromptOptions extends BasePromptOptions {
    hint?: string;
    drag?: boolean;
    numbered?: boolean;
}
interface SurveyPromptOptions extends ArrayPromptOptions {
    scale: BasePromptOptionsWithName[];
    margin: [number, number, number, number];
}
interface QuizPromptOptions extends ArrayPromptOptions {
    correctChoice: number;
}
interface TogglePromptOptions extends BasePromptOptions {
    enabled?: string;
    disabled?: string;
}
/** Returns all the prompt options depending on the type selected. */
declare type PromptOptions<T extends boolean = false> = Unionize<{
    [K in PromptTypes]-?: T extends true ? {
        type: K;
    } & PromptOptionsType<K> & {
        name: string | (() => string);
    } : {
        type: K;
    } & PromptOptionsType<K>;
}> | ({
    type: string;
} & T extends true ? PromptOptionsType<string> & {
    name: string | (() => string);
} : PromptOptionsType<string>);
declare type Unionize<T extends Record<PropertyKey, unknown>> = {
    [P in keyof T]: T[P];
}[keyof T];
declare type PromptTypes = 'AutoComplete' | 'BasicAuth' | 'Confirm' | 'Editable' | 'Form' | 'Input' | 'Invisible' | 'List' | 'MultiSelect' | 'Numeral' | 'Password' | 'Quiz' | 'Scale' | 'Select' | 'Snippet' | 'Sort' | 'Survey' | 'Text' | 'Toggle';
declare type PromptOptionsType<T> = T extends keyof PromptOptionsMap ? PromptOptionsMap[T] : T extends string ? BasePromptOptions & Record<PropertyKey, unknown> : any;
declare class PromptOptionsMap implements Record<PromptTypes, Record<PropertyKey, any>> {
    AutoComplete: ArrayPromptOptions;
    BasicAuth: StringPromptOptions;
    Confirm: BooleanPromptOptions;
    Editable: ArrayPromptOptions;
    Form: ArrayPromptOptions;
    Input: StringPromptOptions;
    Invisible: StringPromptOptions;
    List: ArrayPromptOptions;
    MultiSelect: ArrayPromptOptions;
    Numeral: NumberPromptOptions;
    Password: StringPromptOptions;
    Quiz: QuizPromptOptions;
    Scale: ScalePromptOptions;
    Select: ArrayPromptOptions;
    Snippet: SnippetPromptOptions;
    Sort: SortPromptOptions;
    Survey: SurveyPromptOptions;
    Text: StringPromptOptions;
    Toggle: TogglePromptOptions;
}
interface PromptSettings {
    error?: boolean;
    cancelCallback?: (settings?: PromptSettings) => string | Error | PromptError | void;
    stdout?: WriteStream | Writable;
    enquirer?: Enquirer;
}
interface PromptInstance extends Omit<BasePromptOptions, 'onCancel' | 'onSubmit'> {
    submit: () => void;
    cancel: (err?: string) => void;
}

/**
 * Extend the task to have more functionality while accesing from the outside.
 */
declare class TaskWrapper<Ctx, Renderer extends ListrRendererFactory> {
    task: Task<Ctx, ListrRendererFactory>;
    errors: ListrError<Ctx>[];
    private options;
    constructor(task: Task<Ctx, ListrRendererFactory>, errors: ListrError<Ctx>[], options: ListrBaseClassOptions<Ctx, any, any>);
    /** Get the title of the current task. */
    get title(): string;
    /** Change the title of the current task. */
    set title(data: string);
    /** Get the output from the output channel. */
    get output(): string;
    /** Send a output to the output channel. */
    set output(data: string);
    /** Create a new subtask with given renderer selection from the parent task. */
    newListr<NewCtx = Ctx>(task: ListrTask<NewCtx, Renderer> | ListrTask<NewCtx, Renderer>[] | ((parent: Omit<this, 'skip' | 'enabled'>) => ListrTask<NewCtx, Renderer> | ListrTask<NewCtx, Renderer>[]), options?: ListrSubClassOptions<NewCtx, Renderer>): Listr<NewCtx, any, any>;
    /** Report a error in process for error collection. */
    report(error: Error, type: ListrErrorTypes): void;
    /** Skip current task. */
    skip(message?: string): void;
    /** Get the number of retrying, else returns false */
    isRetrying(): Task<Ctx, Renderer>['retry'];
    /**
     * Create a new Enquirer prompt using prompt options.
     *
     * Since process.stdout is controlled by Listr, this will passthrough all Enquirer data through internal stdout.
     */
    prompt<T = any>(options: PromptOptions | PromptOptions<true>[]): Promise<T>;
    /** Cancels the current prompt attach to this task. */
    cancelPrompt(throwError?: boolean): void;
    /**
     * Pass stream of data to internal stdout.
     *
     * Since Listr2 takes control of process.stdout utilizing the default renderer, any data outputted to process.stdout
     * will corupt its looks.
     *
     * This returns a fake stream to pass any stream inside Listr as task data.
     */
    stdout(): NodeJS.WriteStream & NodeJS.WritableStream;
    /** Run this task. */
    run(ctx: Ctx): Promise<void>;
}

/** Available task states. */
declare enum ListrTaskState {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    ROLLING_BACK = "ROLLING_BACK",
    ROLLED_BACK = "ROLLED_BACK",
    RETRY = "RETRY"
}

/**
 * Create a task from the given set of variables and make it runnable.
 */
declare class Task<Ctx, Renderer extends ListrRendererFactory> extends Subject<ListrEvent> {
    listr: Listr<Ctx, any, any>;
    tasks: ListrTask<Ctx, any>;
    options: ListrOptions;
    rendererOptions: ListrGetRendererOptions<Renderer>;
    /** Unique id per task, randomly generated in the uuid v4 format */
    id: string;
    /** The current state of the task. */
    state: string;
    /** The task object itself, to further utilize it. */
    task: (ctx: Ctx, task: TaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    /** Extend current task with multiple subtasks. */
    subtasks: Task<Ctx, any>[];
    /** Title of the task */
    title?: string;
    /** Untouched unchanged title of the task */
    initialTitle?: string;
    /** Output data from the task. */
    output?: string;
    /** Skip current task. */
    skip: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean | string>);
    /** Current retry number of the task if retrying */
    retry?: {
        count: number;
        withError?: any;
    };
    /**
     * A channel for messages.
     *
     * This requires a separate channel for messages like error, skip or runtime messages to further utilize in the renderers.
     */
    message: {
        /** Run time of the task, if it has been successfully resolved. */
        duration?: number;
        /** Error message of the task, if it has been failed. */
        error?: string;
        /** Skip message of the task, if it has been skipped. */
        skip?: string;
        /** Rollback message of the task, if the rollback finishes */
        rollback?: string;
        /** Retry messages */
        retry?: {
            count: number;
            withError?: any;
        };
    };
    /** Per task options for the current renderer of the task. */
    rendererTaskOptions: ListrGetRendererTaskOptions<Renderer>;
    /** This will be triggered each time a new render should happen. */
    renderHook$: Subject<void>;
    prompt: undefined | PromptInstance | PromptError;
    private enabled;
    private enabledFn;
    constructor(listr: Listr<Ctx, any, any>, tasks: ListrTask<Ctx, any>, options: ListrOptions, rendererOptions: ListrGetRendererOptions<Renderer>);
    set state$(state: ListrTaskState);
    set output$(data: string);
    set message$(data: Task<Ctx, Renderer>['message']);
    set title$(title: string);
    /**
     * A function to check whether this task should run at all via enable.
     */
    check(ctx: Ctx): Promise<void>;
    /** Returns whether this task has subtasks. */
    hasSubtasks(): boolean;
    /** Returns whether this task is in progress. */
    isPending(): boolean;
    /** Returns whether this task is skipped. */
    isSkipped(): boolean;
    /** Returns whether this task has been completed. */
    isCompleted(): boolean;
    /** Returns whether this task has been failed. */
    hasFailed(): boolean;
    /** Returns whether this task has an active rollback task going on. */
    isRollingBack(): boolean;
    /** Returns whether the rollback action was successful. */
    hasRolledBack(): boolean;
    /** Returns whether this task has an actively retrying task going on. */
    isRetrying(): boolean;
    /** Returns whether enabled function resolves to true. */
    isEnabled(): boolean;
    /** Returns whether this task actually has a title. */
    hasTitle(): boolean;
    /** Returns whether this task has a prompt inside. */
    isPrompt(): boolean;
    /** Run the current task. */
    run(context: Ctx, wrapper: TaskWrapper<Ctx, Renderer>): Promise<void>;
}

/** Default updating renderer for Listr2 */
declare class DefaultRenderer implements ListrRenderer {
    tasks: Task<any, typeof DefaultRenderer>[];
    options: typeof DefaultRenderer['rendererOptions'];
    renderHook$?: Task<any, any>['renderHook$'];
    /** designates whether this renderer can output to a non-tty console */
    static nonTTY: boolean;
    /** renderer options for the defauult renderer */
    static rendererOptions: {
        /**
         * indentation per level of subtask
         *
         * @default 2
         */
        indentation?: number;
        /**
         * clear all the output generated by the renderer when the task finishes its execution
         *
         * @default false
         * @global global option that can not be temperated with subtasks
         */
        clearOutput?: boolean;
        /**
         * show the subtasks of the current task
         *
         * @default true
         */
        showSubtasks?: boolean;
        /**
         * collapse subtasks after current task completes its execution
         *
         * @default true
         */
        collapse?: boolean;
        /**
         * show skip messages or show the original title of the task, this will also disable collapseSkips mode
         *
         * You can disable showing the skip messages, even though you passed in a message by settings this option,
         * if you want to keep the original task title intact.
         *
         * @default true
         */
        showSkipMessage?: boolean;
        /**
         * collapse skip messages into a single message and overwrite the task title
         *
         * @default true
         */
        collapseSkips?: boolean;
        /**
         * suffix skip messages with [SKIPPED] when in collapseSkips mode
         *
         * @default true
         */
        suffixSkips?: boolean;
        /**
         * shows the thrown error message or show the original title of the task, this will also disable collapseErrors mode
         * You can disable showing the error messages, even though you passed in a message by settings this option,
         * if you want to keep the original task title intact.
         *
         * @default true
         */
        showErrorMessage?: boolean;
        /**
         * collapse error messages into a single message and overwrite the task title
         *
         * @default true
         */
        collapseErrors?: boolean;
        /**
         * suffix retry messages with [RETRY-${COUNT}] when retry is enabled for a task
         *
         * @default true
         */
        suffixRetries?: boolean;
        /**
         * only update through triggers from renderhook
         *
         * useful for tests and stuff. this will disable showing spinner and only update the screen if something else has
         * happened in the task worthy to show
         *
         * @default false
         * @global global option that can not be temperated with subtasks
         */
        lazy?: boolean;
        /**
         * show duration for all tasks
         *
         * @default false
         * @global global option that can not be temperated with subtasks
         */
        showTimer?: boolean;
        /**
         * removes empty lines from the data output
         *
         * @default true
         */
        removeEmptyLines?: boolean;
        /**
         * formats data output depending on your requirements.
         *
         * @default 'truncate'
         * @global global option that can not be temperated with subtasks
         */
        formatOutput?: 'truncate' | 'wrap';
    };
    /** per task options for the default renderer */
    static rendererTaskOptions: {
        /**
         * write task output to the bottom bar instead of the gap under the task title itself.
         * useful for a stream of data.
         * @default false
         *
         * `true` only keep 1 line of the latest data outputted by the task.
         * `false` only keep 1 line of the latest data outputted by the task.
         * `number` will keep designated data of the latest data outputted by the task.
         */
        bottomBar?: boolean | number;
        /**
         * keep output after task finishes
         * @default false
         *
         * works both for the bottom bar and the default behavior
         */
        persistentOutput?: boolean;
        /**
         * show the task time if it was successful
         */
        showTimer?: boolean;
    };
    private id?;
    private bottomBar;
    private promptBar;
    private readonly spinner;
    private spinnerPosition;
    constructor(tasks: Task<any, typeof DefaultRenderer>[], options: typeof DefaultRenderer['rendererOptions'], renderHook$?: Task<any, any>['renderHook$']);
    getTaskOptions(task: Task<any, typeof DefaultRenderer>): typeof DefaultRenderer['rendererTaskOptions'];
    isBottomBar(task: Task<any, typeof DefaultRenderer>): boolean;
    hasPersistentOutput(task: Task<any, typeof DefaultRenderer>): boolean;
    hasTimer(task: Task<any, typeof DefaultRenderer>): boolean;
    getSelfOrParentOption<T extends keyof typeof DefaultRenderer['rendererOptions']>(task: Task<any, typeof DefaultRenderer>, key: T): typeof DefaultRenderer['rendererOptions'][T];
    getTaskTime(task: Task<any, typeof DefaultRenderer>): string;
    createRender(options?: {
        tasks?: boolean;
        bottomBar?: boolean;
        prompt?: boolean;
    }): string;
    render(): void;
    end(): void;
    private multiLineRenderer;
    private renderBottomBar;
    private renderPrompt;
    private dumpData;
    private formatString;
    private indentMultilineOutput;
    private getSymbol;
    private addSuffixToMessage;
}

declare class SilentRenderer implements ListrRenderer {
    tasks: Task<any, typeof SilentRenderer>[];
    options: typeof SilentRenderer['rendererOptions'];
    /** designates whether this renderer can output to a non-tty console */
    static nonTTY: boolean;
    /** renderer options for the silent renderer */
    static rendererOptions: never;
    /** per task options for the silent renderer */
    static rendererTaskOptions: never;
    constructor(tasks: Task<any, typeof SilentRenderer>[], options: typeof SilentRenderer['rendererOptions']);
    render(): void;
    end(): void;
}

/**
 * This is the default renderer which is neither verbose or updating.
 * It provides short output like update renderer, but does not disturb
 * stdin during execution of listr tasks
 */
declare class SimpleRenderer implements ListrRenderer {
    readonly tasks: Task<any, typeof SimpleRenderer>[];
    options: typeof SimpleRenderer['rendererOptions'];
    static nonTTY: boolean;
    static rendererOptions: {
        /**
         * if true this will add
         * timestamp at the begin of the rendered line
         *
         * @example
         *
         * ```bash
         * [12:33:44] ✔ Do something important
         * ```
         *
         * @default false
         */
        prefixWithTimestamp?: boolean;
        /**
         * choose between process.stdout and process.stderr
         *
         * @default stdout
         */
        output?: 'stdout' | 'stderr';
    };
    static rendererTaskOptions: never;
    /**
     * Event type renderer map contains functions to process different task events
     */
    eventTypeRendererMap: Partial<{
        [P in ListrEventType]: (t: Task<any, typeof SimpleRenderer>, event: ListrEventFromType<P>) => void;
    }>;
    constructor(tasks: Task<any, typeof SimpleRenderer>[], options: typeof SimpleRenderer['rendererOptions']);
    static now(): Date;
    static formatTitle(task?: Task<any, typeof SimpleRenderer>): string;
    log(output?: string): void;
    end(): void;
    render(tasks?: Task<any, typeof SimpleRenderer>[]): void;
}

/** Default loglevels for the logger */
declare enum LogLevels {
    SILENT = "SILENT",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    SUCCESS = "SUCCESS",
    DATA = "DATA",
    STARTED = "STARTED",
    TITLE = "TITLE",
    RETRY = "RETRY",
    ROLLBACK = "ROLLBACK"
}

/**
 * Options for the logger
 */
interface LoggerOptions {
    useIcons: boolean;
}

/**
 * A internal logger for using in the verbose renderer mostly.
 */
declare class Logger {
    private options?;
    constructor(options?: LoggerOptions);
    fail(message: string): void;
    skip(message: string): void;
    success(message: string): void;
    data(message: string): void;
    start(message: string): void;
    title(message: string): void;
    retry(message: string): void;
    rollback(message: string): void;
    protected parseMessage(level: LogLevels, message: string): string;
    protected logColoring({ level, message }: {
        level: LogLevels;
        message: string;
    }): string;
    private wrapInBrackets;
}

declare class VerboseRenderer implements ListrRenderer {
    tasks: Task<any, typeof VerboseRenderer>[];
    options: typeof VerboseRenderer['rendererOptions'];
    /** designates whether this renderer can output to a non-tty console */
    static nonTTY: boolean;
    /** renderer options for the verbose renderer */
    static rendererOptions: ({
        /**
             * useIcons instead of text for log level
             * @default false
             */
        useIcons?: boolean;
        /**
             * log tasks with empty titles
             * @default true
             */
        logEmptyTitle?: boolean;
        /**
             * log title changes
             * @default true
             */
        logTitleChange?: boolean;
        /**
             * show duration for all tasks
             */
        showTimer?: boolean;
    } & {
        /**
             * inject a custom logger
             */
        logger?: new (...args: any) => Logger;
        /**
             * inject options to custom logger
             */
        options?: any;
    });
    /** per task options for the verbose renderer */
    static rendererTaskOptions: never;
    private logger;
    constructor(tasks: Task<any, typeof VerboseRenderer>[], options: typeof VerboseRenderer['rendererOptions']);
    render(): void;
    end(): void;
    private verboseRenderer;
}

/** The default renderer value used in Listr2 applications */
declare type ListrDefaultRendererValue = 'default';
/** Type of default renderer */
declare type ListrDefaultRenderer = typeof DefaultRenderer;
/** Name of default fallback renderer */
declare type ListrFallbackRendererValue = 'verbose';
/** Type of default fallback renderer */
declare type ListrFallbackRenderer = typeof VerboseRenderer;
/** Silent rendere for internal usage */
declare type ListrSilentRendererValue = 'silent';
/** Typeof silent renderer */
declare type ListrSilentRenderer = typeof SilentRenderer;
/** Simple renderer that simplifies things */
declare type ListrSimpleRendererValue = 'simple';
/** Typeof simple renderer */
declare type ListrSimpleRenderer = typeof SimpleRenderer;
/**
 * Listr2 can process either the integrated renderers as string aliases,
 * or utilize a compatible style renderer that extends the ListrRenderer abstract class.
 */
declare type ListrRendererValue = ListrSilentRendererValue | ListrDefaultRendererValue | ListrSimpleRendererValue | ListrFallbackRendererValue | ListrRendererFactory;
/**
 * Returns the class type from friendly names of the renderers.
 */
declare type ListrGetRendererClassFromValue<T extends ListrRendererValue> = T extends ListrDefaultRendererValue ? ListrDefaultRenderer : T extends ListrSimpleRendererValue ? ListrSimpleRenderer : T extends ListrFallbackRendererValue ? ListrFallbackRenderer : T extends ListrSilentRenderer ? ListrSilentRenderer : T extends ListrRendererFactory ? T : never;
/**
 * Returns the friendly names from the type of renderer classes.
 */
declare type ListrGetRendererValueFromClass<T extends ListrRendererFactory> = T extends DefaultRenderer ? ListrDefaultRendererValue : T extends SimpleRenderer ? ListrSimpleRendererValue : T extends VerboseRenderer ? ListrFallbackRendererValue : T extends SilentRenderer ? ListrSilentRenderer : T extends ListrRendererFactory ? T : never;
/**
 * Returns renderer global options depending on the renderer type.
 */
declare type ListrGetRendererOptions<T extends ListrRendererValue> = T extends ListrDefaultRendererValue ? ListrDefaultRenderer['rendererOptions'] : T extends ListrSimpleRendererValue ? ListrSimpleRenderer['rendererOptions'] : T extends ListrFallbackRendererValue ? ListrFallbackRenderer['rendererOptions'] : T extends ListrSilentRenderer ? ListrSilentRenderer['rendererOptions'] : T extends ListrRendererFactory ? T['rendererOptions'] : never;
/**
 * Returns renderer per task options depending on the renderer type.
 */
declare type ListrGetRendererTaskOptions<T extends ListrRendererValue> = T extends ListrDefaultRendererValue ? ListrDefaultRenderer['rendererTaskOptions'] : T extends ListrSimpleRendererValue ? ListrSimpleRenderer : T extends ListrFallbackRendererValue ? ListrFallbackRenderer['rendererTaskOptions'] : T extends ListrSilentRenderer ? ListrSilentRenderer['rendererTaskOptions'] : T extends ListrRendererFactory ? T['rendererTaskOptions'] : never;
/** Select renderer as default renderer */
interface ListrDefaultRendererOptions<T extends ListrRendererValue> {
    /** the default renderer */
    renderer?: T;
    /** Renderer options depending on the current renderer */
    rendererOptions?: ListrGetRendererOptions<T>;
}
/** Select a fallback renderer to fallback to in non-tty conditions */
interface ListrDefaultNonTTYRendererOptions<T extends ListrRendererValue> {
    /** the fallback renderer to fallback to on non-tty conditions */
    nonTTYRenderer?: T;
    /** Renderer options depending on the current renderer */
    nonTTYRendererOptions?: ListrGetRendererOptions<T>;
}
/** Renderer options for the base class, including setup for selecting default and fallback renderers.  */
declare type ListrRendererOptions<Renderer extends ListrRendererValue, FallbackRenderer extends ListrRendererValue> = ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>;
/** The bones of a listr renderer. */
declare class ListrRenderer {
    /** designate renderer global options that is specific to the current renderer */
    static rendererOptions: Record<PropertyKey, any>;
    /** designate renderer per task options that is specific to the current renderer  */
    static rendererTaskOptions: Record<PropertyKey, any>;
    /** designate whether this renderer can work in non-tty environments */
    static nonTTY: boolean;
    /** A function to what to do on render */
    render: () => void;
    /** A function to what to do on end of the render */
    end: (err?: Error) => void;
    /** create a new renderer */
    constructor(tasks: readonly Task<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions, renderHook$?: Subject<void>);
}
/** Exported for javascript applications to extend the base renderer */
declare class ListrBaseRenderer implements ListrRenderer {
    static rendererOptions: Record<PropertyKey, any>;
    static rendererTaskOptions: Record<PropertyKey, any>;
    static nonTTY: boolean;
    tasks: Task<any, typeof ListrBaseRenderer>[];
    options: typeof ListrBaseRenderer.rendererOptions;
    render: () => void;
    end: (err?: Error) => void;
    constructor(tasks: Task<any, typeof ListrBaseRenderer>[], options: typeof ListrBaseRenderer.rendererOptions);
}
/** A renderer factory from the current type */
declare type ListrRendererFactory = typeof ListrRenderer;
/** Supported type of renderers for each type in the listr. */
interface SupportedRenderer {
    renderer: ListrRendererFactory;
    nonTTY: boolean;
}

/** The internal error handling mechanism.. */
declare class ListrError<Ctx extends Record<PropertyKey, any> = Record<PropertyKey, any>> extends Error {
    error: Error;
    type: ListrErrorTypes;
    task: Task<Ctx, ListrRendererFactory>;
    path: string;
    ctx: Ctx;
    constructor(error: Error, type: ListrErrorTypes, task: Task<Ctx, ListrRendererFactory>);
}
/**
 * The actual error type that is collected and to help identify where the error is triggered from.
 */
declare enum ListrErrorTypes {
    /** Task has failed and will try to retry. */
    WILL_RETRY = "WILL_RETRY",
    /** Task has failed and will try to rollback. */
    WILL_ROLLBACK = "WILL_ROLLBACK",
    /** Task has failed, ran the rollback action but the rollback action itself has failed. */
    HAS_FAILED_TO_ROLLBACK = "HAS_FAILED_TO_ROLLBACK",
    /** Task has failed. */
    HAS_FAILED = "HAS_FAILED",
    /** Task has failed, but exitOnError is set to false, so will ignore this error. */
    HAS_FAILED_WITHOUT_ERROR = "HAS_FAILED_WITHOUT_ERROR"
}
/** The internal error handling mechanism for prompts only. */
declare class PromptError extends Error {
    constructor(message: string);
}

/**
 * Creates a new set of Listr2 task list.
 */
declare class Listr<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> {
    task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>;
    parentTask?: Task<any, any>;
    tasks: Task<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    err: ListrError<Ctx>[];
    ctx: Ctx;
    rendererClass: ListrRendererFactory;
    rendererClassOptions: ListrGetRendererOptions<ListrRendererFactory>;
    renderHook$: Task<any, any>['renderHook$'];
    path: string[];
    private concurrency;
    private renderer;
    constructor(task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>, parentTask?: Task<any, any>);
    add(task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[]): void;
    run(context?: Ctx): Promise<Ctx>;
    private checkAll;
    private runTask;
}

/**
 * Creates a new Listr2 task manager.
 *
 * Useful for creating a single instace of Listr2 with pre-set settings.
 */
declare class Manager<Ctx = ListrContext, Renderer extends ListrRendererValue = 'default', FallbackRenderer extends ListrRendererValue = 'verbose'> {
    options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>;
    err: ListrError[];
    private tasks;
    constructor(options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>);
    set ctx(ctx: Ctx);
    add<InjectCtx = Ctx>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[] | ((ctx?: InjectCtx) => ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[]), options?: ListrSubClassOptions<InjectCtx, Renderer>): void;
    runAll<InjectCtx = Ctx>(options?: ListrBaseClassOptions<InjectCtx, Renderer, FallbackRenderer>): Promise<InjectCtx>;
    newListr<InjectCtx, InjectRenderer extends ListrRendererValue = Renderer, InjectFallbackRenderer extends ListrRendererValue = FallbackRenderer>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<InjectRenderer>>[], options?: ListrBaseClassOptions<InjectCtx, InjectRenderer, InjectFallbackRenderer>): Listr<InjectCtx, InjectRenderer, InjectFallbackRenderer>;
    indent<InjectCtx = Ctx>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[] | ((ctx?: InjectCtx) => ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[]), options?: ListrBaseClassOptions<InjectCtx, Renderer, FallbackRenderer>, taskOptions?: Omit<ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>, 'task'>): ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>;
    run<InjectCtx = Ctx>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<InjectCtx, Renderer, FallbackRenderer>): Promise<InjectCtx>;
    getRuntime(pipetime: number): string;
}

/**
 * Create a new prompt with Enquirer externally.
 * This extends enquirer so you dont have to give a name to single prompts and such so it is also
 * useful to use externally.
 * @param this
 * @param options
 * @param settings
 */
declare function createPrompt(this: any, options: PromptOptions | PromptOptions<true>[], settings?: PromptSettings): Promise<any>;
declare function destroyPrompt(this: TaskWrapper<any, any>, throwError?: boolean): void;

declare const figures: {
    warning: string;
    cross: string;
    arrowDown: string;
    tick: string;
    arrowRight: string;
    pointer: string;
    checkboxOn: string;
    arrowLeft: string;
    squareSmallFilled: string;
    pointerSmall: string;
};

export { Listr, ListrBaseClassOptions, ListrBaseRenderer, ListrContext, ListrDefaultNonTTYRendererOptions, ListrDefaultRenderer, ListrDefaultRendererOptions, ListrDefaultRendererValue, ListrError, ListrErrorTypes, ListrEvent, ListrEventFromType, ListrEventType, ListrFallbackRenderer, ListrFallbackRendererValue, ListrGetRendererClassFromValue, ListrGetRendererOptions, ListrGetRendererTaskOptions, ListrGetRendererValueFromClass, ListrOptions, ListrRenderer, ListrRendererFactory, ListrRendererOptions, ListrRendererValue, ListrSilentRenderer, ListrSilentRendererValue, ListrSimpleRenderer, ListrSimpleRendererValue, ListrSubClassOptions, ListrTask, Task as ListrTaskObject, ListrTaskResult, ListrTaskState, TaskWrapper as ListrTaskWrapper, LogLevels, Logger, Manager, PromptError, PromptInstance, PromptOptions, PromptOptionsMap, PromptOptionsType, PromptSettings, PromptTypes, SupportedRenderer, Unionize, createPrompt, destroyPrompt, figures };
