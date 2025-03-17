"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";

const SignInPage = () => {
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
        <SignIn.Root>
          {/* LOGIN WITH CREDENTIALS */}
          <SignIn.Step name="start">
            <Clerk.Field name="identifier" className="flex flex-col gap-2">
              <Clerk.Input
                placeholder="请输入邮箱..."
                className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
              />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>
            <SignIn.Action
              submit
              className="mt-2 text-sm underline w-72 text-center text-iconBlue"
            >
              继续
            </SignIn.Action>
          </SignIn.Step>
          <SignIn.Step name="verifications">
            <SignIn.Strategy name="password">
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="password"
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <div className="flex flex-col gap-2">
                <SignIn.Action
                  submit
                  className="mt-2 text-sm underline w-72 text-center text-iconBlue"
                >
                  继续
                </SignIn.Action>
                <SignIn.Action
                  navigate="forgot-password"
                  className="mt-2 text-sm underline w-72 text-center "
                >
                  忘记密码？
                </SignIn.Action>
              </div>
            </SignIn.Strategy>
            <SignIn.Strategy name="reset_password_email_code">
              <p className="text-sm mb-2">
                发送了验证码：
                <SignIn.SafeIdentifier />.
              </p>

              <Clerk.Field name="code" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="Verification Code"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="mt-2 text-sm underline w-72 text-center text-iconBlue"
              >
                继续
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>
          <SignIn.Step
            name="forgot-password"
            className="flex justify-between w-72 text-sm"
          >
            <SignIn.SupportedStrategy name="reset_password_email_code">
              <span className="underline text-iconBlue">重置密码</span>
            </SignIn.SupportedStrategy>

            <SignIn.Action navigate="previous" className="underline">
              返回
            </SignIn.Action>
          </SignIn.Step>
          <SignIn.Step name="reset-password">
            <h1>重置你的密码</h1>

            <Clerk.Field name="password">
              <Clerk.Label>新密码</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>

            <Clerk.Field name="confirmPassword">
              <Clerk.Label>确认密码</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>

            <SignIn.Action submit>重置密码</SignIn.Action>
          </SignIn.Step>
          {/* OR SIGN UP */}
          <div className="w-72 flex items-center gap-4">
            <div className="h-px bg-borderGray flex-grow"></div>
            <span className="text-textGrayLight">或</span>
            <div className="h-px bg-borderGray flex-grow"></div>
          </div>
          <Link
            href="/sign-up"
            className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center"
          >
            创建账户
          </Link>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default SignInPage;
