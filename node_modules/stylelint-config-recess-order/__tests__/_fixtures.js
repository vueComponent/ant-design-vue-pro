export const incorrectOrder = `
    div {
        background-color: slategray;
        box-sizing: border-box;
        flex: 1 1 auto;
        font-size: 1.5rem;
        grid-gap: 16px;
        order: 1;
        pointer-events: all;
        position: relative;
        transition: opacity 300ms ease;
        width: 320px;
    }`

export const correctOrder = `
    div {
        position: relative;
        box-sizing: border-box;
        flex: 1 1 auto;
        grid-gap: 16px;
        order: 1;
        width: 320px;
        font-size: 1.5rem;
        pointer-events: all;
        background-color: slategray;
        transition: opacity 300ms ease;
    }`
