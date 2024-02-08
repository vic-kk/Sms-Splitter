import { ChangeEvent, useState } from 'react'
import { textSplitterV3 as textSplitter } from './utils';
import './App.css'

function App() {
  const [splittedSms, setSplittedSms] = useState<string>();

  const textareaHandle = async (
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { target: { value: text = '' } } = e;
    const start = new Date().getTime();
    console.log('start', 0);
    const result = await textSplitter(text)
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        console.log('end', new Date().getTime() - start, 'ms');
      })
    setSplittedSms(() =>
      result ? JSON.stringify(result) : ''
    );
  };

  return (
    <div className='wrap'>
      <div>
        <p>input</p>
        <textarea
          className='input'
          onChange={textareaHandle}
        />
      </div>

      <div>
        <p>output</p>
        <div className='output'>{splittedSms}</div>
      </div>
    </div>
  )
}

export default App
