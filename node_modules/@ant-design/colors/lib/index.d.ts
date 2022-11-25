import generate from './generate';
export interface PalettesProps {
    [key: string]: string[] & {
        primary?: string;
    };
}
declare const presetPrimaryColors: {
    [key: string]: string;
};
declare const presetPalettes: PalettesProps;
declare const red: string[] & {
    primary?: string | undefined;
};
declare const volcano: string[] & {
    primary?: string | undefined;
};
declare const gold: string[] & {
    primary?: string | undefined;
};
declare const orange: string[] & {
    primary?: string | undefined;
};
declare const yellow: string[] & {
    primary?: string | undefined;
};
declare const lime: string[] & {
    primary?: string | undefined;
};
declare const green: string[] & {
    primary?: string | undefined;
};
declare const cyan: string[] & {
    primary?: string | undefined;
};
declare const blue: string[] & {
    primary?: string | undefined;
};
declare const geekblue: string[] & {
    primary?: string | undefined;
};
declare const purple: string[] & {
    primary?: string | undefined;
};
declare const magenta: string[] & {
    primary?: string | undefined;
};
declare const grey: string[] & {
    primary?: string | undefined;
};
export { generate, presetPalettes, presetPrimaryColors, red, volcano, orange, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta, grey, };
