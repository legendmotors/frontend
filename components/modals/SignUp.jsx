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
import { useTranslation } from "react-i18next";

// Validation Schema (you can later choose to translate these error messages as well)
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
  const { t } = useTranslation();
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [email, setEmail] = useState(""); // Store email for OTP verification
  const [loadingOtp, setLoadingOtp] = useState(false); // Loading state for OTP request
  const [timer, setTimer] = useState(0); // Countdown timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer active state

  // Function to request OTP
  const handleRequestOtp = async () => {
    if (!email) {
      alert(t("enter_valid_email"));
      return;
    }

    setLoadingOtp(true);
    try {
      const response = await GetUserLogin.requestOtp({ email });
      if (response.success) {
        alert(t("otp_sent"));
        setOtpSent(true);
        setIsTimerActive(true);
        startTimer();
      } else {
        alert(response.message || t("failed_to_send_otp"));
      }
    } catch (error) {
      alert(t("error_sending_otp"));
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
                  alt={t("register_image_alt")}
                  src="/assets/images/section/register.jpg"
                  width={384}
                  height={854}
                />
              </div>
              <div className="content">
                <h1 className="title-login">{t("register")}</h1>
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
                        alert(t("invalid_otp"));
                        setSubmitting(false);
                        return;
                      }

                      // Step 2: Register user after OTP verification
                      const userResponse = await GetUserLogin.getUserRegister(values);
                      if (userResponse.success) {
                        alert(t("registration_success"));
                        window.location.replace("/");
                      } else {
                        alert(userResponse.message || t("failed_to_register"));
                      }
                    } catch (error) {
                      alert(t("error_registering"));
                    }
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-5 dark:text-white">
                      <div>
                        <label htmlFor="firstName">{t("name")}</label>
                        <div className="relative text-white-dark">
                          <Field
                            id="firstName"
                            name="firstName"
                            type="text"
                            className="form-input ps-10 placeholder:text-white-dark"
                            placeholder={t("enter_name")}
                          />
                        </div>
                        <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                      </div>

                      {/* Email Input */}
                      <div className="mt-3">
                        <label htmlFor="email">{t("email")}</label>
                        <div className="relative text-white-dark">
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className="form-input ps-10 placeholder:text-white-dark"
                            placeholder={t("enter_email")}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setFieldValue("email", e.target.value);
                            }}
                            disabled={otpSent}
                          />
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
                            {loadingOtp ? t("sending_welcome_code") : t("welcome_code")}
                          </button>
                        )}

                        {otpSent && isTimerActive && (
                          <p className="text-sm text-gray-400 mt-2">
                            {t("resend_welcome_code_in", { timer })}
                          </p>
                        )}

                        {!isTimerActive && otpSent && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary mt-2 w-full"
                            onClick={handleRequestOtp}
                          >
                            {t("resend_welcome_code")}
                          </button>
                        )}
                      </div>

                      {/* OTP Input - Shown only after OTP is sent */}
                      {otpSent && (
                        <div>
                          <label htmlFor="otp">{t("enter_otp")}</label>
                          <div className="relative text-white-dark">
                            <Field
                              id="otp"
                              name="otp"
                              type="text"
                              className="form-input ps-10 placeholder:text-white-dark"
                              placeholder={t("enter_otp")}
                            />
                          </div>
                          <ErrorMessage name="otp" component="div" className="text-red-500 text-sm" />
                        </div>
                      )}

                      {/* Password Input */}
                      <div className="mt-3">
                        <label htmlFor="password">{t("password")}</label>
                        <div className="relative text-white-dark">
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            className="form-input ps-10 placeholder:text-white-dark"
                            placeholder={t("enter_password")}
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
                        className="sc-button !mt-6 w-full border-0 mt-3 text-white"
                      >
                        {isSubmitting ? t("submitting") : t("sign_up")}
                      </button>
                    </Form>
                  )}
                </Formik>
                <div className="text-box text-center fs-14">
                  {t("already_have_account")}
                  <a
                    className="font-2 fw-7 fs-14 color-popup text-color-3 ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#popup_bid"
                  >
                    {t("login")}
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
