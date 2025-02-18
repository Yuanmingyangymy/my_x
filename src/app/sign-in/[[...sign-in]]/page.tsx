"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="h-screen flex items-center justify-between p-8">
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="320"
          height="320"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M 26.609375 29.023438 L 3.425781 29.023438 L 3.425781 26.707031 L 24.3125 26.707031 L 24.3125 23.242188 L 3.390625 23.242188 L 3.441406 0.015625 L 11.46875 0.015625 L 11.46875 17.117188 L 9.167969 17.117188 L 9.167969 2.335938 L 5.738281 2.335938 L 5.695312 20.925781 L 26.609375 20.925781 L 26.609375 29.023438"
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
            <span className="text-textGrayLight">or</span>
            <div className="h-px bg-borderGray flex-grow"></div>
          </div>
          <Link
            href="/sign-up"
            className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center"
          >
            创建账户
          </Link>
          <p className="w-72 text-xs">
            By signing up, you agree to the{" "}
            <span className="text-iconBlue">Terms of Service</span> and{" "}
            <span className="text-iconBlue">Privacy Policy</span>, including{" "}
            <span className="text-iconBlue">Cookie Use</span>.
          </p>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default SignInPage;
