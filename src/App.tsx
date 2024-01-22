import { ChangeEvent, useState } from 'react'
import { textSplitter } from './utils';
import './App.css'

function App() {
  const [ splittedSms, setSplittedSms ] = useState<string[]>();

  const textareaHandle = (
    e:ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const result = textSplitter(e);
    console.log(result);
    setSplittedSms(() => result);
  };

  return (
    <div className='wrap'>
      <div>
        <p>input</p>
        <textarea
          className='textarea'
          onChange={textareaHandle}
        />
      </div>

      <div>
        <p>output</p>
        <div className='output'>{JSON.stringify(splittedSms)}</div>
      </div>
    </div>
  )
}

export default App
