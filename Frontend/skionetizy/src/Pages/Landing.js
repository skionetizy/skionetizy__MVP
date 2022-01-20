import React, { useEffect, useRef, useState } from "react";
import Button from "../Components/Button";
import styles from "./Landing.module.css";
// import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Donate from "../Components/DonateButton";
import clsx from "../utils/clsx";
import Footer from "../Components/Footer";
import Frame1 from "../Assets/landing-page/frame-1.svg";
import Frame2 from "../Assets/landing-page/frame-2.svg";
import Frame3 from "../Assets/landing-page/frame-3.svg";
import Frame4 from "../Assets/landing-page/frame-4.svg";
import Frame5 from "../Assets/landing-page/frame-5.svg";
import FeatureItem from "../Components/FeatureItem";
import InfiniteCarousel from "react-leaf-carousel";
import { connect } from "react-redux";

function Homepage(props) {
  const isLoggedIn = props.isLogin;

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#about") {
      document.getElementById("about").scrollIntoView();
    } else if (location.hash === "#mission") {
      document.getElementById("mission").scrollIntoView();
    }
  }, [location]);


  return (
    <>
      <main className={styles.wrapper}>
        {/* Slide 1 */}
        <div className={styles.hero__grid}>
          <img className={styles.hero__img} src={Frame5} alt={""} />

          <div className={styles.hero__text}>
            <div
              className={clsx(
                styles["hero__subtitle"],
                styles["hero__subtitle--large"]
              )}
            >
              <p>Papersdrop, a place to learn, create and share</p>
            </div>

            <Link to={isLoggedIn ? "/" : "/login"}>
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Slide 2 */}
        <div
          id="whats-skionetizy"
          className={clsx(
            styles["hero__grid"],
            styles["hero__grid--left-border"]
          )}
        >
          {/* Text */}
          <div className={styles["hero__text"]}>
            <div className={styles["hero__subtitle"]}>
              <h1 className={styles["heading"]}>What is PaperDrop?</h1>


              <p>
                Papersdrop, a place to learn, create and share thoughts and
                voices of your own. A person can create amazing content with
                just a splash of ink. We at Papersdrop want to serve as a medium
                for you to write.
              </p>
              <p>
                With us, your opinion matters and we provide you with various
                seo tools and features to write beautiful and engaging content.
                With every drop of ink, we give you a platform to create content
                like never before.
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <img className={styles["hero__img"]} src={Frame4} alt={""} />
        </div>

        {/* Middle Sign Up Form */}

        {/* <div id="subscribe" className={styles["subscribe-form"]}>
          <h2 className={styles["subscribe-form__title"]}>
            Do you think you can make <br /> your content better?
          </h2>

          <p className={styles["subscribe-form__subtitle"]}>
            Just like us, if you believe in yourself and your content, subscribe
            here. We know you will because we know that you have the power to
            create something beautiful and worth reading.
          </p>

          <div className={styles["subscribe-form__control"]}>
                        <Button
                            link
                            to="https://skionetizy-staging.herokuapp.com/subscribe"
                            isExternalLink
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="dark"
                            type="button"
                        >
                            Subscribe
                        </Button>

                        <Button variant="none" type="button">
                         Demo
                        </Button>
                    </div> 
        </div> */}

        {/* Slide 3 */}
        <div id="about" className={styles["hero__grid"]}>
          {/* Hero Image */}
          <img
            className={clsx(styles["hero__img"], styles["hero__img"])}
            src={Frame1}
            alt={""}
          />

          {/* Text */}
          <div className={styles["hero__text"]}>
            <div className={styles["hero__subtitle"]}>
              <h1 className={styles["heading"]}>About us</h1>
              <p>
                Our mission drives us to do everything possible needed to make
                something that can help the content writers who are obscure with
                regards to how to do and how to manage their abilities.
              </p>
              <p>
                Motivated by our own encounters, we comprehend the trouble and
                difficulties a limited scale content essayist can face to share
                their work. So, we are here to furnish you with a stage where
                composing, making and sharing all turns into a joyous experience
                for both the reader and the writer.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 4 */}
        <div id="mission" className={styles["hero__grid"]}>
          {/* Text */}
          <div className={styles["hero__text"]}>
            <div className={styles["hero__subtitle"]}>
              <h1 className={styles["heading"]}>Our mission</h1>


              <p>
                As we see arising content authors and content creators
                surrounding us, we expect to give them an environment where they
                can make content and simultaneously share their abilities.
              </p>
              <p>
                Our central goal is to urge limited scope content writers to
                approach and grandstand their ability by furnishing them with
                features such as SEO tools. We accept that each piece you create
                is worth reading, and we plan to make it simpler for you to
                write and share simultaneously.
              </p>
            </div>
          </div>
          {/* Hero Image */}
          <img className={styles["hero__img"]} src={Frame2} alt={""} />
        </div>

        {/* Slide 5 */}
        <div id="why-choose-us" className={styles["hero__grid"]}>
          {/* Hero Image */}
          <img className={styles["hero__img"]} src={Frame3} alt={""} />
          {/* Text */}
          <div className={styles["hero__text"]}>
            <div className={styles["hero__subtitle"]}>
              <h1 className={styles["heading"]}>Why choose us?</h1>

              <p>
                Everytime we create something, there is something special about
                it, something that is never created before in our own unique
                way. Most of us want to share that unique content with the
                world. However, it's not easy for everyone to come forward and
                grab attention.
              </p>
              <p>
                Just like you, we are also finding our way to enter the
                competitive world and create something of our own. You should be
                a part of this journey because we understand the challenges that
                you may face to get your content out there. We are here and
                willing to make it easier for you to get your skills monetised.
              </p>
            </div>
          </div>
        </div>

        <InfiniteCarousel
          showSides={false}
          sidesOpacity={1}
          breakpoints={[
            {
              breakpoint: 768,
              settings: {
                sideSize: 0,
                slidesToScroll: 1,
                slidesToShow: 1,
              },
            },
          ]}
          // autoCycle={true}
          // slidesToShow={4}
          // cycleInterval={3000}
          autoCycle={true}
          slidesToShow={4}
          cycleInterval={3000}
        >
          <FeatureItem name={"Your Feed"} image={"/feed.png"} />
          <FeatureItem name={"SEO Tools"} image={"/seo.png"} />
          <FeatureItem name={"Grammar Checker"} image={"/grammar.png"} />
          <FeatureItem name={"View"} image={"/view.png"} />
        </InfiniteCarousel>

        {/* Bottom Donation Form */}
        <div
          id="donation"
          className={clsx(styles["subscribe-form"], styles["donation-form"])}
        >
          <h2
            className={clsx(
              styles["subscribe-form__title"],
              styles["donation-form__title"]
            )}
          >
            Support Us
          </h2>

          {/* <p
            className={clsx(
              styles["subscribe-form__subtitle"],
              styles["donation-form__subtitle"]
            )}
          >
            We are proudly a group of ambitious students who saw a problem and
            decided to come up with a solution.
          </p> */}

          <p
            className={clsx(
              styles["subscribe-form__subtitle"],
              styles["donation-form__subtitle"]
            )}
          >
            We are proudly a group of ambitious students who saw a problem and
            decided to come up with a solution. But we can't complete it without
            you. We rely on donations to carry out our mission. Every penny you
            donate will be used in the development of this website.
          </p>

          <div className={styles["subscribe-form__control"]}>
            <div className={"donateBtn"}>
              <Donate variant="default">Support Us</Donate>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin
  };
};

export default connect(mapStateToProps, null)(Homepage);