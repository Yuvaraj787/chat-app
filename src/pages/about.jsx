import React from 'react'
import "../styles/about.css"
import pic1 from "../assets/reply.png"
import { Link, Element } from 'react-scroll'
import { Navigate, useNavigate } from 'react-router-dom'
function About() {
  const navigate = useNavigate();
  return (
    <div>
    <section id="about" className="section1">
        <div className="container1" >
            <div className="section1-content">
               <div className="image-container1">
                    <img className="app-image" src={"/icons8-chat-96.png"} alt="ChatGPT App" />
                </div>
                <div>
               <div className="section1-title1">ChitChat<br />
               <div style={{fontSize:"1rem", marginLeft:"20px"}}>Connecting world throught sockets</div>
               </div>
               </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", columnGap:"30px"}}>
              <Link
               to="feat" 
               spy={true} smooth={true} duration={500}
               delay={0}
              >
                Features
                </Link>
                <Link
               to="about-us" 
               spy={true} smooth={true} duration={200}
               delay={0}
              >
                Our Team
                </Link>
                <span onClick={()=> {
                  navigate("/login")
                }}>
                  Get started
                </span>
            </div>
        </div>
    </section>
    <Element id="feat">
    <section id="features" className="section1 features" style={{height:"140vh"}}>
        <div className="container1">
            <h2 className="section1-title">Key Features</h2>
            <div className="feature">
                <div className="feature-image">
                    <img src={pic1} style={{mixBlendMode:"multiply"}} alt="Chat Suggestions" />
                </div>
                <div className="feature-info">
                    <h3 className="feature-title">Real-time Chat Suggestions</h3>
                    <p>Elevate user engagement and convenience with ChatGPT's real-time chat suggestions, making conversations smoother and more engaging.</p>
                </div>
            </div>
            <div className="feature">
                <div className="feature-image">
                    <img  src="https://o.remove.bg/downloads/980f2931-ad49-43a9-83dd-821c7a6f4714/images-removebg-preview.png" alt="Change Native Language" />
                </div>
                <div className="feature-info">
                    <h3 className="feature-title">Change Native Language</h3>
                    <p>Enable language translation to enhance communication for users from diverse backgrounds.</p>
                </div>
            </div>
            <div className="feature">
                <div className="feature-image">
                    <img style={{mixBlendMode:"multiply"}} src="data:image/png;base64,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" alt="Send and Download Images" />
                </div>
                <div className="feature-info">
                    <h3 className="feature-title">Send and Download Images</h3>
                    <p>Effortlessly send and download images within your chat conversations, enhancing the overall user experience.</p>
                </div>
            </div>
            <div className="feature">
                <div className="feature-image">
                    <img style={{mixBlendMode:"multiply"}} src="data:image/png;base64,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" alt="Play Tic Tac Toe" />
                </div>
                <div className="feature-info">
                    <h3 className="feature-title">Play Tic Tac Toe</h3>
                    <p>Challenge your friends to a game of Tic Tac Toe while chatting and enhance the social aspect of your chat application.</p>
                </div>
            </div>
            
        </div>
    </section>
    </Element>
    <Element id="about-us">
    <section id="features" className="section1 features" style={{height:"70vh", backgroundColor:"#fff"}}>
    <h2 className="section1-title">Our Team</h2>
        <div className="container-cont">
            {[
              {name:"Yuvaraj V",role:"developer",img:""},
              {name:"AdnanKhan S",role:"developer",img:""},
              {name:"Akash P",role:"developer",img:""}].map(e => 
                <div className="developer-row">
                <div className="developer-photo">
                  <img src={"data:image/png;base64,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"} alt={`${e.name}'s Profile`} />                  
                </div>
                <div className="developer-info">
                    <h3>{e.name}</h3>
                    <p>{e.role}</p>
                  </div>
              </div>
              )}
        </div>
    </section>
    </Element>
    </div>
  )
}

export default About