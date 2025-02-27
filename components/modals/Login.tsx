"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { GetUserLogin } from "@/services";
import CleverTap from "clevertap-web-sdk/clevertap"; // ✅ Import CleverTap SDK

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (typeof window !== "undefined" && GetUserLogin.isAuthenticate()) {
      router.push("/");
    }
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoaded(true);

    try {
      const data = { email: user.email, password: user.password };
      const response = await GetUserLogin.getUserLogin(data);

      console.log(response, "response");


      if (response) {
        // Store token & redirect
        GetUserLogin.authenticate(response, () => {
          window.location.replace("/");
        });

        // ✅ Send user login event to CleverTap
        CleverTap.onUserLogin.push({
          Site: {
            Identity: user.email || `user_${Date.now()}`,
            Email: user.email,
            Name: user.email ? user.email.split("@")[0] : "Unknown User",
            "MSG-email": true,
            "MSG-push": true,
            "MSG-sms": false,
            "MSG-whatsapp": true,
          },
        });
        console.log("CleverTap: User Login Event Sent");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please check your email & password",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: "An error occurred. Please try again.",
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
                <Image alt="Login Image" src="/assets/images/section/login.jpg" width={380} height={640} />
              </div>
              <div className="content">
                <h1 className="title-login">Login</h1>
                <div className="comments">
                  <div className="respond-comment">
                    <form onSubmit={handleSubmit} className="comment-form form-submit">
                      <fieldset>
                        <label className="fw-6">Account</label>
                        <input
                          type="email"
                          id="email"
                          className="tb-my-input"
                          name="email"
                          placeholder="Your email"
                          value={user.email}
                          onChange={handleChange}
                          required
                        />
                      </fieldset>
                      <fieldset className="style-wrap">
                        <label className="fw-6">Password</label>
                        <input
                          type="password"
                          className="input-form password-input"
                          name="password"
                          placeholder="Your password"
                          value={user.password}
                          onChange={handleChange}
                          required
                        />
                      </fieldset>
                      <div className="title-forgot">
                        <a className="fs-14 fw-4">Forgot password</a>
                      </div>
                      <button className="sc-button" name="submit" type="submit" disabled={isLoaded}>
                        <span>{isLoaded ? "Signing in..." : "Login"}</span>
                      </button>
                    </form>
                  </div>
                </div>
                <div className="text-box text-center fs-14">
                  Don’t have an account?{" "}
                  <a className="font-2 fw-7 fs-14 color-popup text-color-3" data-bs-toggle="modal" data-bs-target="#popup_bid2">
                    Register
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
