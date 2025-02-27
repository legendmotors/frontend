"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import IconLockDots from "@/components/icon/icon-lock-dots";
import IconMail from "@/components/icon/icon-mail";
import IconUser from "@/components/icon/icon-user";
import { GetUserLogin } from "@/services";

// Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

export default function SignUp() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [email, setEmail] = useState(""); // Store email for OTP verification
  const [loadingOtp, setLoadingOtp] = useState(false); // Loading state for OTP request
  const [timer, setTimer] = useState(0); // Countdown timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer active state

  // Function to request OTP
  const handleRequestOtp = async () => {
    if (!email) {
      alert("Please enter a valid email before requesting OTP.");
      return;
    }

    setLoadingOtp(true);
    try {
      const response = await GetUserLogin.requestOtp({ email });
      if (response.success) {
        alert("OTP has been sent to your email.");
        setOtpSent(true);
        setIsTimerActive(true);
        startTimer();
      } else {
        alert(response.message || "Failed to send OTP");
      }
    } catch (error) {
      alert("Error sending OTP, please try again.");
    }
    setLoadingOtp(false);
  };

  // Function to start a 60-second countdown timer
  const startTimer = () => {
    let timeLeft = 60;
    setTimer(timeLeft);
    const countdown = setInterval(() => {
      timeLeft -= 1;
      setTimer(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdown);
        setIsTimerActive(false);
      }
    }, 1000);
  };

  return (
    <div
      className="modal fade popup login-form"
      id="popup_bid2"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <div className="modal-body space-y-20 pd-40 style2">
            <div className="wrap-modal flex">
              <div className="images flex-none relative">
                <Image
                  alt="Register Image"
                  src="/assets/images/section/register.jpg"
                  width={384}
                  height={854}
                />
              </div>
              <div className="content">
                <h1 className="title-login">Register</h1>
                <Formik
                  initialValues={{
                    firstName: "",
                    email: "",
                    password: "",
                    otp: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      // Step 1: Verify OTP
                      const otpResponse = await GetUserLogin.verifyOtp({
                        email: values.email,
                        otp: values.otp,
                      });
                      if (!otpResponse.success) {
                        alert("Invalid OTP. Please try again.");
                        setSubmitting(false);
                        return;
                      }

                      // Step 2: Register user after OTP verification
                      const userResponse = await GetUserLogin.getUserRegister(values);
                      if (userResponse.success) {
                        alert("Registration successful!");
                        window.location.replace("/");
                      } else {
                        alert(userResponse.message || "Failed to register");
                      }
                    } catch (error) {
                      alert("Error registering user, please try again.");
                    }
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-5 dark:text-white">
                      <div>
                        <label htmlFor="firstName">Name</label>
                        <div className="relative text-white-dark">
                          <Field
                            id="firstName"
                            name="firstName"
                            type="text"
                            className="form-input ps-10 placeholder:text-white-dark"
                            placeholder="Enter Name"
                          />
                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconUser fill={true} />
                          </span>
                        </div>
                        <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label htmlFor="email">Email</label>
                        <div className="relative text-white-dark">
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className="form-input ps-10 placeholder:text-white-dark"
                            placeholder="Enter Email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setFieldValue("email", e.target.value);
                            }}
                            disabled={otpSent}
                          />
                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconMail fill={true} />
                          </span>
                        </div>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

                        {/* OTP Request / Resend */}
                        {!otpSent && (
                          <button
                            type="button"
                            className="btn btn-outline-primary mt-2 w-full"
                            onClick={handleRequestOtp}
                            disabled={loadingOtp}
                          >
                            {loadingOtp ? "Sending OTP..." : "Send OTP"}
                          </button>
                        )}

                        {otpSent && isTimerActive && (
                          <p className="text-sm text-gray-400 mt-2">Resend OTP in {timer} seconds</p>
                        )}

                        {!isTimerActive && otpSent && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary mt-2 w-full"
                            onClick={handleRequestOtp}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      {/* OTP Input - Shown only after OTP is sent */}
                      {otpSent && (
                        <div>
                          <label htmlFor="otp">Enter OTP</label>
                          <div className="relative text-white-dark">
                            <Field
                              id="otp"
                              name="otp"
                              type="text"
                              className="form-input ps-10 placeholder:text-white-dark"
                              placeholder="Enter OTP"
                            />
                          </div>
                          <ErrorMessage name="otp" component="div" className="text-red-500 text-sm" />
                        </div>
                      )}

                      {/* Password Input */}
                      <div>
                        <label htmlFor="password">Password</label>
                        <div className="relative text-white-dark">
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            className="form-input ps-10 placeholder:text-white-dark"
                            placeholder="Enter Password"
                          />
                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconLockDots fill={true} />
                          </span>
                        </div>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                      >
                        {isSubmitting ? "Submitting..." : "Sign Up"}
                      </button>
                    </Form>
                  )}
                </Formik>
                <div className="text-box text-center fs-14">
                  Don’t you have an account?{" "}
                  <a
                    className="font-2 fw-7 fs-14 color-popup text-color-3"
                    data-bs-toggle="modal"
                    data-bs-target="#popup_bid"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
