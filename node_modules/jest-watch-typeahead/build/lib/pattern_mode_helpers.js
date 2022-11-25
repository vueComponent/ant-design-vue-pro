import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const pluralize = (count, text) => count === 1 ? text : `${text}s`;

export const printPatternMatches = (count, entity, pipe, extraText = '') => {
  const pluralized = pluralize(count, entity);
  const result = count ? `\n\n Pattern matches ${count} ${pluralized}` : `\n\n Pattern matches no ${pluralized}`;
  pipe.write(result + extraText);
};
export const printStartTyping = (entity, pipe) => {
  pipe.write(`\n\n ${chalk.italic.yellow(`Start typing to filter by a ${entity} regex pattern.`)}`);
};
export const printMore = (entity, pipe, more) => {
  pipe.write(`\n   ${chalk.dim(`...and ${more} more ${pluralize(more, entity)}`)}`);
};
export const printTypeaheadItem = (item, pipe) => {
  pipe.write(`\n ${chalk.dim('\u203A')} ${item}`);
};
export const formatTypeaheadSelection = (item, index, activeIndex, prompt) => {
  if (index === activeIndex) {
    prompt.setPromptSelection(stripAnsi(item));
    return chalk.black.bgYellow(stripAnsi(item));
  }

  return item;
};