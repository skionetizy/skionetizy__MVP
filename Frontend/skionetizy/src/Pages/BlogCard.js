import React from 'react';
import './ExploreBlogs.css';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

function blogCard() {
    return (
        <div>
            {/* card section is here */}
            <div className="main">
                {/* Card-1 is here  */}
                <div className="card-box">
                    <div className="card-image">
                    </div>
                    <div className="title">
                        My title here
                    </div>
                    <div className="name">
                        <div className="avtar">
                        </div><h3>Full Name Here</h3></div>
                    <div className="footer">
                        <div className="date">
                            april 2
                        </div>
                        <div className="like">
                          512 <ThumbUpAltIcon /> 184 <ThumbDownIcon/>
                        </div>
                    </div>

                </div>

                
            </div>
        </div>
    )
}

export default blogCard
