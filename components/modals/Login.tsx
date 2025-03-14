"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { GetUserLogin } from "@/services";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [clevertap, setClevertap] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("clevertap-web-sdk/clevertap").then((ct) => {
        setClevertap(ct.default); // Store CleverTap module
      });
    }
  }, []);

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (typeof window !== "undefined" && GetUserLogin.isAuthenticate()) {
      router.push("/");
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoaded(true);

    try {
      const data = { email: user.email, password: user.password };
      const response = await GetUserLogin.getUserLogin(data);

      console.log(response, "response");

      if (response) {
        GetUserLogin.authenticate(response, () => {
          window.location.reload()
        });

        // Ensure CleverTap is available before using it
        if (clevertap) {
          clevertap.onUserLogin.push({
            Site: {
              Identity: user.email || `user_${Date.now()}`,
              Email: user.email,
              Name: user.email ? user.email.split("@")[0] : t("unknown_user"),
              "MSG-email": true,
              "MSG-push": true,
              "MSG-sms": false,
              "MSG-whatsapp": true,
            },
          });
          console.log("CleverTap: User Login Event Sent");
        } else {
          console.warn("CleverTap not initialized yet.");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: t("oops"),
          text: t("check_credentials"),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("login_error"),
        text: t("login_error_text"),
      });
    } finally {
      setIsLoaded(false);
    }
  };

  return (
    <div className="modal fade popup login-form" id="popup_bid" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <div className="modal-body space-y-20 pd-40">
            <div className="wrap-modal flex">
              <div className="images flex-none">
                <Image
                  alt={t("login_image_alt")}
                  src="/assets/images/section/login.jpg"
                  width={380}
                  height={640}
                />
              </div>
              <div className="content">
                <h1 className="title-login">{t("login")}</h1>
                <div className="comments">
                  <div className="respond-comment">
                    <form onSubmit={handleSubmit} className="comment-form form-submit">
                      <fieldset>
                        <label className="fw-6">{t("account")}</label>
                        <input
                          type="email"
                          id="email"
                          className="tb-my-input"
                          name="email"
                          placeholder={t("your_email")}
                          value={user.email}
                          onChange={handleChange}
                          required
                        />
                      </fieldset>
                      <fieldset className="style-wrap">
                        <label className="fw-6">{t("password")}</label>
                        <input
                          type="password"
                          className="input-form password-input"
                          name="password"
                          placeholder={t("your_password")}
                          value={user.password}
                          onChange={handleChange}
                          required
                        />
                      </fieldset>
                      <div className="title-forgot">
                        <a className="fs-14 fw-4">{t("forgot_password")}</a>
                      </div>
                      <button className="sc-button" name="submit" type="submit" disabled={isLoaded}>
                        <span>{isLoaded ? t("signing_in") : t("login")}</span>
                      </button>
                    </form>
                  </div>
                </div>
                <div className="text-box text-center fs-14">
                  {t("dont_have_account")}{" "}
                  <a
                    className="font-2 fw-7 fs-14 color-popup text-color-3"
                    data-bs-toggle="modal"
                    data-bs-target="#popup_bid2"
                  >
                    {t("register")}
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
