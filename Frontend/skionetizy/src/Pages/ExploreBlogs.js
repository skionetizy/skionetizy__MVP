import React from 'react'
import { Link } from "react-router-dom";
import "./ExploreBlogs.css"
import PersonIcon from '@material-ui/icons/Person';
function ExploreBlogs() {
    
    return (

        <div className="container">
            
            {/* ---------------------card section starts here------------------- */}
            {/* ----------------1st card-------------- */}
            <div className="card">
            <div className="card-image"></div>
            <div className="card-text">
                
                <div className="date">4 days ago</div>
                    <h2>post 1</h2>
                    <p>     Lorem ipsum dolor sit amet consectetur adipisicing
                    elit.Saepe eos id quisquam nemo magni, dolores fugit veritatis,maxime,
                    aliquam debitis quod consectetur totam nihil voluptatem corrupti nisi et
                    recusandae <Link to="#">Read More</Link>
                    </p>
            </div>  
                <div className="card-stats">
                <div className="stat profile_icon">
                        <div className="value"><PersonIcon/></div>
                        <div className="type">Firstname</div>
                    </div>
                    <div className="stat">
                        <div className="value">123</div>
                        <div className="type">read</div>
                    </div>
                    <div className="stat">
                        <div className="value">125</div>
                        <div className="type">views</div>
                    </div>
                    <div className="stat">
                        <div className="value">21</div>
                        <div className="type">likes</div>
                    </div>
                    
                </div> 
                
            </div>
            {/* ----------------2nd card-------------- */}
            <div className="card">
            <div className="card-image"></div>
            <div className="card-text">
                <div className="date">4 days ago</div>
                    <h2>post 1</h2>
                    <p>     Lorem ipsum dolor sit amet consectetur adipisicing
                    elit.Saepe eos id quisquam nemo magni, dolores fugit veritatis,maxime,
                    aliquam debitis quod consectetur totam nihil voluptatem corrupti nisi et
                    recusandae officia?
                    </p>
            </div>  
                <div className="card-stats">
                    <div className="stat">
                        <div className="value">123</div>
                        <div className="type">read</div>
                    </div>
                    <div className="stat">
                        <div className="value">125</div>
                        <div className="type">views</div>
                    </div>
                    <div className="stat">
                        <div className="value">21</div>
                        <div className="type">likes</div>
                    </div>
                    
                </div> 
                
            </div>
            {/* ----------------3rd card-------------- */}
            <div className="card">
            <div className="card-image"></div>
            <div className="card-text">
                <div className="date">4 days ago</div>
                    <h2>post 1</h2>
                    <p>     Lorem ipsum dolor sit amet consectetur adipisicing
                    elit.Saepe eos id quisquam nemo magni, dolores fugit veritatis,maxime,
                    aliquam debitis quod consectetur totam nihil voluptatem corrupti nisi et
                    recusandae officia?
                    </p>
            </div>  
                <div className="card-stats">
                    <div className="stat">
                        <div className="value">123</div>
                        <div className="type">read</div>
                    </div>
                    <div className="stat">
                        <div className="value">125</div>
                        <div className="type">views</div>
                    </div>
                    <div className="stat">
                        <div className="value">21</div>
                        <div className="type">likes</div>
                    </div>
                </div> 
                
            </div>
            {/* ----------------1st card-------------- */}
            <div className="card">
            <div className="card-image"></div>
            <div className="card-text">
                <div className="date">4 days ago</div>
                    <h2>post 1</h2>
                    <p>     Lorem ipsum dolor sit amet consectetur adipisicing
                    elit.Saepe eos id quisquam nemo magni, dolores fugit veritatis,maxime,
                    aliquam debitis quod consectetur totam nihil voluptatem corrupti nisi et
                    recusandae officia?
                    </p>
            </div>  
                <div className="card-stats">
                    <div className="stat">
                        <div className="value">123</div>
                        <div className="type">read</div>
                    </div>
                    <div className="stat">
                        <div className="value">125</div>
                        <div className="type">views</div>
                    </div>
                    <div className="stat">
                        <div className="value">21</div>
                        <div className="type">likes</div>
                    </div>
                </div> 
                
            </div>
            {/* ----------------1st card-------------- */}
            <div className="card">
            <div className="card-image"></div>
            <div className="card-text">
                <div className="date">4 days ago</div>
                    <h2>post 1</h2>
                    <p>     Lorem ipsum dolor sit amet consectetur adipisicing
                    elit.Saepe eos id quisquam nemo magni, dolores fugit veritatis,maxime,
                    aliquam debitis quod consectetur totam nihil voluptatem corrupti nisi et
                    recusandae officia?
                    </p>
            </div>  
                <div className="card-stats">
                    <div className="stat">
                        <div className="value">123</div>
                        <div className="type">read</div>
                    </div>
                    <div className="stat">
                        <div className="value">125</div>
                        <div className="type">views</div>
                    </div>
                    <div className="stat">
                        <div className="value">21</div>
                        <div className="type">likes</div>
                    </div>
                </div> 
                
            </div>
        </div>

    )
}

export default ExploreBlogs
