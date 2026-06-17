"use client";

import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";

import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const components = {
  SignIn: {
    Header() {
      return (
        <View className="mt-1 mb-7 text-center">
          <Heading level={3} className="text-2xl! font-bold!">
            Leaf
            <span className="text-secondary-500 font-light hover:text-primary-300!">
              Rental
            </span>
          </Heading>
          <p className="text-muted-foreground mt-2 text-sm">
            <span className="font-bold">Welcome back! </span>
            Please sign in to your account to continue.
          </p>
        </View>
      );
    },
    Footer() {
      const { toSignUp } = useAuthenticator((context) => [context.toSignUp]);

      return (
        <View className="mt-4 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-primary font-medium hover:underline hover:text-primary-700! bg-transparent border-none cursor-pointer! p-0"
            >
              Sign Up
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator((context) => [
        context.validationErrors,
      ]);

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },

    Header() {
      return (
        <View className="mt-1 mb-7 text-center">
          <Heading level={3} className="text-2xl! font-bold!">
            Leaf
            <span className="text-secondary-500 font-light hover:text-primary-300!">
              Rental
            </span>
          </Heading>
          <p className="text-muted-foreground mt-2 text-sm">
            <span className="font-bold">Welcome back! </span>
            Please create an account to continue.
          </p>
        </View>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator((context) => [context.toSignIn]);

      return (
        <View className="mt-4 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="text-primary font-medium hover:underline hover:text-primary-700! bg-transparent border-none cursor-pointer! p-0"
            >
              Sign In
            </button>
          </p>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
      isRequired: true,
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      label: "Username",
      placeholder: "Choose your username",
      isRequired: true,
    },
    email: {
      order: 2,
      label: "Email",
      placeholder: "Enter your email address",
      type: "email",
      isRequired: true,
    },
    password: {
      order: 3,
      label: "Password",
      placeholder: "Create your password",
      type: "password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      label: "Confirm Password",
      placeholder: "Confirm your password",
      type: "password",
      isRequired: true,
    },
  },
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup|forgot-password)$/);
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  // Allow unauthenticated users to access public pages
  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.includes("/signin") ? "signIn" : "signUp"}
        components={components}
        formFields={formFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
