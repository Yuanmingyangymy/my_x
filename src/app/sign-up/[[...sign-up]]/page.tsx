"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="h-screen flex items-center justify-between p-8">
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <svg
          width="184"
          height="180"
          viewBox="0 0 184 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4.00001"
            y1="1.74846e-07"
            x2="4"
            y2="180"
            stroke="white"
            strokeWidth="8"
          />
          <path
            d="M112 4L148 4L184 4"
            stroke="white"
            strokeWidth="8"
            strokeDasharray="16 16"
          />
          <path
            d="M112 176L148 176H184"
            stroke="white"
            strokeWidth="8"
            strokeDasharray="16 16"
          />
          <path d="M80 176L116 176" stroke="white" strokeWidth="8" />
          <line
            x1="180"
            y1="4"
            x2="180"
            y2="176"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="square"
            strokeDasharray="16 16"
          />
          <line
            x1="116"
            y1="4"
            x2="116"
            y2="176"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="square"
            strokeDasharray="16 16"
          />
          <path d="M115 1L80 179" stroke="white" strokeWidth="8" />
          <path d="M51 105L51 180" stroke="white" strokeWidth="8" />
          <path
            d="M94 107L52 4H9L81 176M3.00002 176H52"
            stroke="white"
            strokeWidth="8"
          />
        </svg>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h1 className="text-2xl xsm:text-4xl md:text-6xl font-bold">
          欢迎加入MY
        </h1>
        <h1 className="text-2xl ">Hello~</h1>
        <SignUp.Root>
          <SignUp.Step name="start" className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Clerk.Field name="username" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="用户名"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="邮箱"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="密码"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <SignUp.Captcha />
              <SignUp.Action
                submit
                className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center "
              >
                注册
              </SignUp.Action>
            </div>
          </SignUp.Step>
          <SignUp.Step name="continue" className="flex flex-col gap-4">
            <Clerk.Field name="username">
              <Clerk.Input
                placeholder="用户名"
                className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
              />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>

            <SignUp.Action
              submit
              className="w-72 text-center text-iconBlue underline"
            >
              继续
            </SignUp.Action>
          </SignUp.Step>
          <SignUp.Step name="verifications">
            <SignUp.Strategy name="email_code">
              <h1 className="text-sm mb-2">查看你的邮箱</h1>
              <Clerk.Field name="code" className="flex flex-col gap-4">
                <Clerk.Input
                  placeholder="验证码"
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <SignUp.Action
                submit
                className="mt-2 underline text-iconBlue text-sm"
              >
                验证
              </SignUp.Action>
            </SignUp.Strategy>
          </SignUp.Step>
          {/* OR SIGN UP */}
          <div className="w-72 flex items-center gap-4">
            <div className="h-px bg-borderGray flex-grow"></div>
            <span className="text-textGrayLight">或</span>
            <div className="h-px bg-borderGray flex-grow"></div>
          </div>
          <Link
            href="/sign-in"
            className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center"
          >
            登录
          </Link>
        </SignUp.Root>
      </div>
    </div>
  );
};

export default SignUpPage;
