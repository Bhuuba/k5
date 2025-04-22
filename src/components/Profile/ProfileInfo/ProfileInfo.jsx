import React from "react";
import s from "./ProfileInfo.module.css"; // Імпорт стилів
import onepage from "./onepage.png"; // Зображення (приклад)
import img1 from "./img1.png"; // Зображення (приклад)
import { NavLink } from "react-router-dom";

import { redirect } from "react-router-dom";

const ProfileInfo = () => {
  return (
    <div className={s.container}>
      {/* <Navigate to="/login" /> */}
      <div className="row justify-content-between mt-5 flex-column flex-md-row">
        <div className="col-lg-7 col-md-7 order-2 order-md-1">
          <div className={s.boxr}>
            <h1 className={s.item}>
              Want anything to be <br /> easy with <b>BrieflyAI</b>
            </h1>
            <p className={s.p}>Your Time. Your Information. Your Comfort.</p>
            <NavLink to="/register" className={s.a}>
              <button className={s.btn}>Get started free</button>
            </NavLink>
          </div>
        </div>
        <div className="col-lg-4 col-md-4 order-1 order-md-2 text-center">
          <div className={s.box}>
            <img className={s.rightimg} src={onepage} alt="my photo" />
          </div>
        </div>
      </div>

      {/* Другий блок: 90+ Users, 30+ Locations, 80+ Servers */}
      <div className={s.container2}>
        <div className="row justify-content-between">
          <div className="col-4">
            <div className={s.sliderpadd}>
              <div className={s.slider1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={s.svg2}
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                <div className={s.svgtext}>
                  <h3 className={s.h3}>90+</h3>
                  <p className={s.p2}>Active{"\n"}Users</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className={s.sliderpadd}>
              <div className={s.slider2}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={s.svg2}
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                </svg>
                <div className={s.svgtext}>
                  <h3 className={s.h3__2}>1000+</h3>
                  <p className={s.p2}>Summaries Generated</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className={s.sliderpadd}>
              <div className={s.slider3}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={s.svg2}
                  viewBox="0 0 16 16"
                >
                  <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z" />
                  <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z" />
                </svg>
                <div className={s.svgtext}>
                  <h3 className={s.h3__3}>5+</h3>
                  <p className={s.p2}>Integrated Platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Третій блок: велике зображення ліворуч, список фіч праворуч */}
      <div className={s.container3}>
        <div className="row align-items-center">
          <div className="col-md-6 col-sm-6 col-6 order-2 order-md-1">
            <div className={s.box1Section2}>
              <img className={s.img1} src={img1} alt="my photo" />
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-6 order-1 order-md-2">
            <section className="features-section">
              <div className="features-section__content">
                <h2 className={s.h2}>
                  We Provide Many <br /> Features You Can Use
                </h2>
                <p className={s.p7}>
                  Our features save you time by turning long content into{" "}
                  <br></br> clear, simple summaries:
                </p>
                <ul className={s.ul}>
                  <li className={s.li}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={s.svg}
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Chat Summarization
                  </li>
                  <li className={s.li}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={s.svg}
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    YouTube Video Summarization
                  </li>
                  <li className={s.li}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={s.svg}
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Text Document Summarization
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
