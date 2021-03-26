import React from 'react'
import './marDown.css'
function MarkDown() {
    return (
        <div className="mainmark">
            <div style={{position:'absolute',left:'5%',top:'14%'}}>
            <p>Enter document name</p>
            <br/>
            <input style={{backgroundColor:'#3498db',color:'white',padding:'5px',border:'1px solid transparent',outline:'none',borderRadius:'5px',width:'110%'}}/>

            </div>
           <textarea  rows="40" cols="85" className="textarea"/>
           <textarea  rows="40" cols="80" className="markdown"/>
        </div>
    )
}

export default MarkDown;
