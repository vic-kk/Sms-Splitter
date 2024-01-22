import { ChangeEvent } from "react";

const initialConfig = (totalTextLenght:number = 0, maxSmsLength:number) => {
  const pagesCount = () => Math.ceil( (totalTextLenght + 1) / maxSmsLength );
  let pages = pagesCount();
  for (let i = 1; i <= pages; i++) {
    totalTextLenght += ` ${i}/${pages}`.length;
  }
  pages = pagesCount();
  return {
    items: [] as string[],
    iterableIndex: 0,
    currentSmsIndex: 0,
    overallCount: pages,
    numOverload: Math.pow(10, `${pages}`.length),
  };
};

export const textSplitter = (
  e:ChangeEvent<HTMLTextAreaElement>,
  maxSmsLength:number = 140,
  maxSmsCount:number = 9999,
) => {
  const { target: { value : wholeText = '' } } = e;  
  if (wholeText.length <= maxSmsLength) return [wholeText];
  
  const sms = initialConfig(wholeText.length, maxSmsLength);

  while (wholeText && sms.iterableIndex < wholeText.length) {
    sms.currentSmsIndex++ && sms.currentSmsIndex > sms.overallCount && (sms.overallCount = sms.currentSmsIndex);

    if (sms.currentSmsIndex > maxSmsCount)
      throw new Error(`So many sms count. Max sms count is (${maxSmsCount})`);

    if (sms.overallCount === sms.numOverload) {
      sms.items = [];
      sms.iterableIndex = 0;
      sms.currentSmsIndex = 1;
      sms.numOverload *= 10;
    }

    const lastSpaceIndex = wholeText
      .concat(' ')
      .substring(
        sms.iterableIndex,
        sms.iterableIndex + maxSmsLength - `${sms.currentSmsIndex}/${sms.overallCount}`.length
      ).lastIndexOf(' ');

    sms.items.push(
      wholeText
        .substring(
          sms.iterableIndex,
          sms.iterableIndex + lastSpaceIndex
        ).trim()
    );

    sms.iterableIndex += lastSpaceIndex;
  }

  return sms.items.map((item, id) => 
    `${item} ${id + 1}/${sms.overallCount}`
  );
}