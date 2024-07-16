"use client";
import React, { useState } from "react";
import Button from "../buttons/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import API from "@/lib/Api";
import { handleError } from "@/lib/errorHandler";
import { useRouter } from "next/navigation";

const AuthForm = ({ type }: any) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const endpoints: any = {
    register: "auth/signup",
    login: "auth/login",
  };

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const data = Object.fromEntries(formData.entries());
      const endpoint = type === "login" ? endpoints.login : endpoints.register;
      return await API.post(endpoint, data);
    },
    onSuccess: async (data: any) => {
      if (data?.data?.accessToken) {
        setSuccessMessage("Login successfull!");
      }
      localStorage.setItem("token", data.uid);
      router.push("/dashboard");
    },
    onError: async (error: any) => {
      const message = handleError(error?.error?.code);
      setErrorMessage(message);
    },
  });
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.target);
    const username: any = formData.get("username")?.toString().trim();
    const password: any = formData.get("password")?.toString().trim();
    const repeatPassword = formData.get("repeatPassword")?.toString().trim();

    const validations: any = {
      username: {
        condition: type === "register" && username?.length < 4,
        message: "Username must be at least 4 characters.",
      },
      password: {
        condition: type === "register" && password?.length < 6,
        message: "Password must be at least 6 characters.",
      },
      repeatPassword: {
        condition: type === "register" && password !== repeatPassword,
        message: "Password confirmation does not match.",
      },
    };

    const validationErrors: any = Object.keys(validations)
      .filter((field) => validations[field].condition)
      .map((field) => validations[field].message);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(" "));
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="loginRegisterForgotForm flex items-center justify-center fixed top-0 left-0 z-20 w-full h-screen bg-[#f5f5f5]">
      <section className="max-h-[90vh] overflow-auto p-3 px-8 w-full max-w-[450px] bg-white rounded-2xl">
        <h2 className="text-black text-[30px] pb-2 flex items-center justify-between">
          {type === "login" ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {(type === "login" || type === "register") && (
            <>
              {type !== "profile" && (
                <div className="w-full flex flex-col gap-1 mt-3">
                  <label className="text-gray-500">Email</label>
                  <input
                    className="p-2 px-4 rounded-xl border text-black hover:shadow-extra-blur duration-300"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                </div>
              )}

              {type === "login" && (
                <div className="w-full flex flex-col gap-1 mt-2">
                  <label className="text-gray-500">Password</label>
                  <input
                    className="p-2 px-4 rounded-xl border text-black hover:shadow-extra-blur duration-300"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </div>
              )}
              {type === "register" && (
                <>
                  {["username", "password", "repeatPassword"].map(
                    (fieldName) => (
                      <div
                        key={fieldName}
                        className="w-full flex flex-col gap-1"
                      >
                        <label htmlFor={fieldName} className="text-gray-500">
                          {fieldName === "repeatPassword"
                            ? "Repeat Password"
                            : `${fieldName
                                .charAt(0)
                                .toUpperCase()}${fieldName.slice(1)}`}{" "}
                          <sup>*</sup>
                        </label>
                        <input
                          id={fieldName}
                          className="p-2 px-4 rounded-xl border text-black hover:shadow-extra-blur duration-300"
                          type={
                            fieldName.includes("password") ? "password" : "text"
                          }
                          name={fieldName}
                          placeholder={
                            fieldName === "repeatPassword"
                              ? "Repeat Password"
                              : `${fieldName
                                  .charAt(0)
                                  .toUpperCase()}${fieldName.slice(1)}`
                          }
                          required
                        />
                      </div>
                    )
                  )}
                </>
              )}
            </>
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <div>
            <Button type="submit">
              {type === "login" ? "Sign In" : "Sign up"}
            </Button>
          </div>
          {type === "login" && (
            <>
              <div className="w-full mb-4">
                <button
                  className="pColor flex gap-2 items-center"
                  onClick={() => router.push("/auth/signup")}
                >
                  Sign up for a new account{" "}
                  <IoIosArrowRoundForward className="w-6 h-6" />
                </button>
              </div>
            </>
          )}
          {type === "register" && (
            <div className="w-full flex gap-8 items-center pColor">
              Already have an account?{" "}
              <a
                onClick={() => router.push("/auth/login")}
                className="pColor cursor-pointer flex gap-2 items-center"
              >
                Login Here <IoIosArrowRoundForward className="w-6 h-6" />
              </a>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default AuthForm;