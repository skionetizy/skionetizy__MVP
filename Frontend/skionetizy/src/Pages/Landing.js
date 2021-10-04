import React from "react";
import Button from "../Components/Button";
import styles from "./Landing.module.css";
// import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Donate from "../Components/DonateButton";
import clsx from "../utils/clsx";
import Footer from "../Components/Footer";
import Frame1 from "../Assets/landing-page/frame-1.svg";
import Frame2 from "../Assets/landing-page/frame-2.svg";
import Frame3 from "../Assets/landing-page/frame-3.svg";
import Frame4 from "../Assets/landing-page/frame-4.svg";
import Frame5 from "../Assets/landing-page/frame-5.svg";
import useAuth from "../hooks/useAuth";

function Homepage() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <main className={styles.wrapper}>
        {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      > */}
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
              <p>
                Skionetizy : A place to create, a place to
                <span className={styles["hero__subtitle--accent"]}> earn.</span>
              </p>
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
            <h1 className={styles["heading"]}>What is Skionetizy?</h1>

            <div className={styles["hero__subtitle"]}>
              <p>
                Every individual has a mind and a voice of it's own. There are
                millions out there who want to read and listen what you have got
                to say. We at skionetizy believe that every thought that crosses
                your mind is unique and it needs to be shared with the world.
              </p>
              <p>
                With us, your opinion matters and we are here to give you a
                platform so that you can create a magic of your own. We provide
                you with features like SEO tools, a space of your own and while
                you are at it, we give you an opportunity to monitise your
                skills.
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <img className={styles["hero__img"]} src={Frame4} alt={""} />
        </div>

        {/* Middle Sign Up Form */}
        <div id="subscribe" className={styles["subscribe-form"]}>
          <h2 className={styles["subscribe-form__title"]}>
            Do you think you can make <br /> your content better?
          </h2>

          <p className={styles["subscribe-form__subtitle"]}>
            Just like us, if you believe in yourself and your content, subscribe
            here. We know you will because we know that you have the power to
            create something beautiful and worth reading.
          </p>

          <div className={styles["subscribe-form__control"]}>
            <a href="/subscribe">
              <Button variant="dark" type="button">
                Subscribe
              </Button>
            </a>

            <Button variant="none" type="button">
              Demo
            </Button>
          </div>
        </div>

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
                We are a team of ambitious students, who want to create
                something that can benefit the small scale writers, writers who
                are obscure about what to do and how to do with their skills.
              </p>{" "}
              <p>
                Inspired by our personal experiences, we understand the
                difficulty and challenges a small scale content writer can face
                to monetise their work. So we are here to provide you with a
                platform where writing, creating and earning both becomes a
                joyous experience for both the reader and the writer.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 4 */}
        <div id="mission" className={styles["hero__grid"]}>
          {/* Text */}
          <div className={styles["hero__text"]}>
            <h1 className={styles["heading"]}>Our mission</h1>

            <div className={styles["hero__subtitle"]}>
              <p>
                As we see emerging content writers and content creaters all
                around us, we aim to provide them with an environment where they
                can create content and at the same time monetise their skills.
              </p>
              <p>
                Our mission is to encourage small scale writers to come forward
                and showcase their talent by providing them with features such
                as SEO tools. We believe that every piece you create is worth
                reading, and we aim to make it easier for you to write and earn
                at the same time.
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
            <h1 className={styles["heading"]}>Why choose us?</h1>
            <div className={styles["hero__subtitle"]}>
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
            Do you think you can make your content better?
          </h2>

          <p
            className={clsx(
              styles["subscribe-form__subtitle"],
              styles["donation-form__subtitle"]
            )}
          >
            Join us and see how easy it is to improve the content you create
          </p>

          <div className={styles["subscribe-form__control"]}>
            <div class="donateBtn">
              <Donate variant="primary">Support Us</Donate>
            </div>
          </div>
        </div>
        {/* </motion.div> */}
      </main>
      <Footer />
    </>
  );
}

export default Homepage;
