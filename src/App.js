import './index.css';
import {useState} from 'react';
import {parse as markupParse} from 'marked';
import DOMPurify from "dompurify";
import { saveAs } from 'file-saver';

let sampleMarkup = `

# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)`;

function saveStaticDataToFile(dataString, type) {
  let blob = new Blob([dataString],
      { type: `text/${type};charset=utf-8` });
  
      let fileInfo = {ext: 'txt', name: 'markup'}
      if(type === 'html') {
        fileInfo.ext = 'html'
        fileInfo.name = 'generated-page'
      };

  saveAs(blob, `${fileInfo.name}.${fileInfo.ext}`);
}


function App() {
  let [markup, setMarkup] = useState(sampleMarkup);
  let [output, setOutput] = useState(markupParse(sampleMarkup));
  let [fullScreenMode, setFullScreenMode] = useState(0);

  function handleChange(e){
    let {value} = e.target;
    let html = markupParse(value);
    setMarkup(value);
    setOutput(DOMPurify.sanitize(html))
  }

  let toggleFullScreenMode = (screenNumber)=>{
    fullScreenMode === screenNumber ? setFullScreenMode(0) : setFullScreenMode(screenNumber)
  } 

  return (
    <div class="wrapper">
    <div class={`screen screen_type_code ${fullScreenMode === 1 ? 'screen_full-screen' : ''}`}>
       <div class="screen__nav">
          <div class="screen__nav-element" title='Save the markup' onClick={()=>saveStaticDataToFile(markup, 'plain')}>
             <i class="screen__nav-element-icon bi bi-download"></i>
          </div>
          <div class="screen__nav-element" onClick={()=>toggleFullScreenMode(1)}>
             <i class={`screen__nav-element-icon bi  ${fullScreenMode === 1 ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`}></i>
          </div>
       </div>
       <textarea class="screen__code-area" onChange={handleChange} id="editor">{markup}</textarea>
    </div>
    <div class={`screen screen_type_viewer ${fullScreenMode === 2 ? 'screen_full-screen' : ''}`}>
       <div class="screen__nav">
          <div class="screen__nav-element" title='Save HTML' onClick={()=>saveStaticDataToFile(output, 'html')}>
             <i class="screen__nav-element-icon bi bi-download"></i>
          </div>
          <div class="screen__nav-element" onClick={()=>toggleFullScreenMode(2)}>
             <i class={`screen__nav-element-icon bi ${fullScreenMode === 2 ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`}></i>
          </div>
       </div>
       <div class="screen__preview-area" dangerouslySetInnerHTML={{ __html: output }} id="preview"></div>
    </div>
 </div>
  );
}

export default App;
