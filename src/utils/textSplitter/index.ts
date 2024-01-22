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
  wholeText:string = "",
  maxSmsLength:number = 140,
  maxSmsCount:number = 9999,
) => {
  wholeText = wholeText.trim();

  if (!wholeText) return
  
  if (wholeText.length <= maxSmsLength) return [wholeText];
  
  const sms = initialConfig(wholeText.length, maxSmsLength);

  while (wholeText && sms.iterableIndex < wholeText.length) {
    sms.currentSmsIndex++ && sms.currentSmsIndex > sms.overallCount && (sms.overallCount = sms.currentSmsIndex);

    if (sms.currentSmsIndex > maxSmsCount)
      throw new Error(`Too many sms. Max SMS count is (${maxSmsCount})`);

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

    const part = wholeText.substring(
      sms.iterableIndex,
      sms.iterableIndex + lastSpaceIndex
    ).trim();

    if (part) sms.items.push(part);

    sms.iterableIndex += lastSpaceIndex + 1;
  }

  return sms.items.map((item, id) => `${item} ${id + 1}/${sms.items.length}`);
}
