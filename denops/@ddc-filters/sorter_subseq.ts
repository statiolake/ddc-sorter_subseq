import { FilterArguments } from "https://deno.land/x/ddc_vim@v3.2.0/base/filter.ts";
import { BaseFilter, Item } from "https://deno.land/x/ddc_vim@v3.2.0/types.ts";

type Params = {};

function caseSensitiveSubsequenceLength(
  haystack: string,
  needle: string,
): number {
  let hidx = 0, nidx = 0;
  let count = 0;
  while (hidx < haystack.length && nidx < needle.length) {
    if (haystack[hidx] == needle[nidx]) {
      // Case-sensitive match, increments count.
      hidx++;
      nidx++;
      count++;
    } else if (haystack[hidx].toLowerCase() == needle[nidx].toLowerCase()) {
      // Case-insensitive match.
      hidx++;
      nidx++;
    } else {
      hidx++;
    }
  }

  return count;
}

export class Filter extends BaseFilter<Params> {
  filter(
    { completeStr, items }: FilterArguments<Params>,
  ): Promise<Item[]> {
    const scoredItems = items.map((item) => ({
      item: item,
      score: this.calcScore(completeStr, item),
    }));
    scoredItems.sort((a, b) => a.score - b.score);
    console.log(scoredItems);
    return Promise.resolve(scoredItems.map((scoredItem) => scoredItem.item));
  }

  params(): Params {
    return {};
  }

  calcScore(completeStr: string, item: Item): number {
    const lengthScore = item.word.length;
    const matchingCapitalScore = caseSensitiveSubsequenceLength(
      item.abbr || item.word,
      completeStr,
    );

    return lengthScore - matchingCapitalScore * 50;
  }
}
