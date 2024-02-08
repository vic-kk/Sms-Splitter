const MAX_SMS_LENGTH:number = 140;
const MAX_SMS_COUNT:number = 9999;

const checkMax = (smsCount: number, limit:number = MAX_SMS_COUNT) => {
  if (smsCount > limit) {
    throw new Error(`Too many sms. Max SMS count is (${MAX_SMS_COUNT})`);
  }
  return smsCount;
};

const initialConfig = async (totalTextLenght:number = 0, maxSmsLength:number) => {
  const pagesCount = () => Math.ceil( (totalTextLenght + 1) / maxSmsLength );
  let pages = checkMax(pagesCount());
  for (let i = 1; i <= pages; i++) {
    totalTextLenght += ` ${i}/${pages}`.length;
  }
  pages = checkMax(pagesCount());
  return {
    items: [] as string[],
    iterableIndex: 0,
    currentSmsIndex: 0,
    overallCount: pages,
    numOverload: Math.pow(10, `${pages}`.length),
  };
};

export const textSplitter = async (
  wholeText:string = "",
  maxSmsLength:number = MAX_SMS_LENGTH,
  maxSmsCount:number = MAX_SMS_COUNT,
) => {
  wholeText = wholeText.trim();

  if (!wholeText) return
  
  if (wholeText.length <= maxSmsLength) return [wholeText];

  const sms = await initialConfig(wholeText.length, maxSmsLength);

  while (wholeText && sms.iterableIndex < wholeText.length) {
    sms.currentSmsIndex++ && sms.currentSmsIndex > sms.overallCount && (sms.overallCount = sms.currentSmsIndex);

    checkMax(sms.currentSmsIndex, maxSmsCount);

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
