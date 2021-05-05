import React, { useState } from 'react'
import './upload.css'
function Upload() {
    const [uploaded,isUploaded]=useState(false)
    const [proImage,setProImage]=useState()
    const handleProfile=(e)=>{
        const file=e.target.files[0];
        setProImage(URL.createObjectURL(e.target.files[0]));
        isUploaded(true)
      
          }
    return (
        <div className="upload_page">
            <div className="upload-btn-wrapper">
            <img src={proImage}/>
            <br/>
           <input type="file"  onChange={(e)=>handleProfile(e)} id="actual-btn" hidden/>
           <br/>
        <label htmlFor="actual-btn">{ uploaded ? 'Save' : 'Choose a file'}</label>
           <br/>
          
           </div>
        </div>
    )
}

export default Upload
