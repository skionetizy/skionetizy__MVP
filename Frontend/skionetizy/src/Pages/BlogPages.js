import React from 'react'
import './ExploreBlogs.css'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


function blogPages() {
    return (
        <div>
            <div className="page-num">
               <ArrowBackIosIcon className="icon"/> <div>1</div> <div>2</div> <div>3</div> <div>4</div> <div>5</div> <ArrowForwardIosIcon className="icon"/>
            </div>
        </div>
    )
}

export default blogPages
