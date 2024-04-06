
 import './App.css'
 import * as dotenv from 'dotenv';
 dotenv.config();

import FileUploader from "./FileUploader"

function App() {

const apiKey = import.meta.env.VITE_API_KEY;

const apiSecret = import.meta.env.VITE_Api_Secret;
const bucketUuid = import.meta.env.VITE_BucketUuid;
// Keys check
// console.log("Keys", apiKey, bucketUuid, apiSecret)
  return (
    <>
   <FileUploader  bucketUuid={bucketUuid} />
    </>
  )
}

export default App
