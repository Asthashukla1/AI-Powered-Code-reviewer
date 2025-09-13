import {useState, useEffect} from 'react'
import CodeReviewer from "./CodeReviewer";
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"



 function App() {
  useEffect(()=>{
    prism.highlightAll()
  })
    return <CodeReviewer />; 
    }

export default App