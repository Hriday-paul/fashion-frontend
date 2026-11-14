"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCreateUserMutation, useCheckUsernameMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import formSchema, { userNameSchema } from "./SignSchema";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import appleIcon from "@/assets/icons/apple.png";
import googleIcon from "@/assets/icons/google.png";
import { UserRole } from "@/types";
import SocailloginFinish from "@/app/(auth)/sign-up/components/SocailloginFinish";

import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase.init";
import SelectCountry from "@/app/(public)/checkout/cart/[cartGroupId]/_components/Billing/SelectCountry";
import { countries } from "@/utils/constant";
import { useAutoSelectCountry } from "@/hooks/useAutoSelectCountry";

const SignUpForm = ({ isCharity = false, role }: { isCharity?: boolean; role: UserRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [createAccount, { isLoading }] = useCreateUserMutation();
  const [checkUsername] = useCheckUsernameMutation();
  const router = useRouter();

  const [isSignupWithEmail, setIsSignupWithEmail] = useState(false);
  const [socialLoginToken, setSocialLoginToken] = useState<{ token: string, name: string | null } | null>(null);

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameMessage, setUsernameMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const watchedUsername = form.watch("userName");
  const watchedCountry = form.watch("country");

  useAutoSelectCountry(form.setValue, watchedCountry);

  useEffect(() => {
    if (!watchedUsername || watchedUsername.trim() === "") {
      setUsernameAvailable(null);
      setUsernameMessage("");
      setIsCheckingUsername(false);
      return;
    }

    const trimmed = watchedUsername.trim();

    // 1. Must pass username validation before calling API
    const validationResult = userNameSchema.safeParse(trimmed);
    if (!validationResult.success) {
      setUsernameAvailable(null);
      setUsernameMessage("");
      setIsCheckingUsername(false);
      return;
    }

    // 2. Debounce API call
    setIsCheckingUsername(true);
    setUsernameAvailable(null);
    setUsernameMessage("");

    const timer = setTimeout(async () => {
      try {
        const res = await checkUsername({ userName: trimmed }).unwrap();
        const isUnavailable =
          res?.data?.isAvailable === false ||
          res?.data?.available === false ||
          res?.success === false;

        if (isUnavailable) {
          const msg = res?.message || "Username is already taken";
          setUsernameAvailable(false);
          setUsernameMessage(msg);
          form.setError("userName", { type: "manual", message: msg });
        } else {
          const msg = res?.message || "Username is available";
          setUsernameAvailable(true);
          setUsernameMessage(msg);
          form.clearErrors("userName");
        }
      } catch (error: any) {
        const msg = error?.data?.message || error?.message || "Username is already taken";
        setUsernameAvailable(false);
        setUsernameMessage(msg);
        form.setError("userName", { type: "manual", message: msg });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [watchedUsername, checkUsername, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isCheckingUsername) {
      toast.info("Please wait while we verify your username.");
      return;
    }

    if (usernameAvailable === false) {
      form.setError("userName", {
        type: "manual",
        message: usernameMessage || "Username is already taken",
      });
      return;
    }

    const countryDetail = countries.find((c) => c.name === data?.country);

    try {
      const res = await createAccount({ ...data, role, country: countryDetail?.code }).unwrap();
      if (res?.data?.otpToken) {
        sessionStorage.removeItem("signUpToken");
        sessionStorage.setItem("verifyOtpToken", res?.data?.otpToken);
        sessionStorage.setItem("signupRole", role);
        sessionStorage.setItem("otpEmail", data.email);
        router.push(`/verify-otp`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred while creating the account.");
    }
  };


  const GoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const res = await signInWithPopup(auth, provider);
    const { displayName } = res.user;
    const token = await res.user.getIdToken(true);

    setSocialLoginToken({ token, name: displayName });

  };

  const AppleLogin = async () => {
    const provider = new OAuthProvider("apple.com");

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);

    const { displayName } = result.user;

    const token = await result.user.getIdToken(true);

    setSocialLoginToken({ token, name: displayName });

  };

  return (
    <Card
      className="max-w-lg mx-auto shadow-none border-none"
    >

      <CardContent className="space-y-4">

        <div className="my-4 md:my-5 lg:my-8 space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold text-center">Welcome to FASHI-ON</h3>
          <p className="text-secondary-gray text-sm lg:text-base">Sign up to start your fashion journey. Discover styles you’ll love and make every look your own.</p>
        </div>

        {socialLoginToken ? <SocailloginFinish socialLoginToken={socialLoginToken} role={role} isCharity={isCharity} /> : isSignupWithEmail &&
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="md:space-y-6 space-y-4">

              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isCharity ? "Organisation Name" : "First Name"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isCharity ? "Organisation Name" : "First Name"}
                        {...field}
                        className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-6 px-3.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Username"
                          {...field}
                          type="text"
                          className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-6 px-3.5 pr-10"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                          {isCheckingUsername && (
                            <Loader2 className="size-4.5 animate-spin text-gray-400" />
                          )}
                          {!isCheckingUsername && usernameAvailable === true && (
                            <Check className="size-4.5 text-green-600" />
                          )}
                          {!isCheckingUsername && usernameAvailable === false && (
                            <X className="size-4.5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc@gmail.com"
                        {...field}
                        type="email"
                        className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-6 px-3.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SelectCountry setValue={form.setValue} control={form.control} />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                          className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black !text-base !py-6 px-3.5"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {showPassword ? (
                            <div
                              onClick={() => setShowPassword(false)}
                              className="cursor-pointer"
                            >
                              <Eye color="#A5A7A9" className="size-5" />
                            </div>
                          ) : (
                            <div
                              onClick={() => setShowPassword(true)}
                              className="cursor-pointer">
                              <EyeOff color="#A5A7A9" className="size-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant={"default"} disabled={isLoading} type="submit" className="rounded-full h-11 w-full cursor-pointer text-base">{isLoading ? <span className="loader"></span> : "Sign Up"}</Button>

            </form>
          </Form>}

        {(!isSignupWithEmail && !socialLoginToken) && (
          <Button variant={"default"} onClick={() => setIsSignupWithEmail(true)} type="button" className="rounded-full h-11 w-full cursor-pointer text-base">{"Continue With Email"}</Button>
        )}

        <div className="flex justify-center gap-x-2 items-center">
          <p className="text-secondary-gray">Already have an account?</p>
          <Link href={"/sign-in"}>
            <span className="text-lg text-primary-red font-medium underline">
              Sign In
            </span>
          </Link>
        </div>

        {(!isSignupWithEmail && !socialLoginToken) && (<>
          <div className="flex  items-center justify-center w-full gap-x-2 text-primary-gray">
            <span className="w-16 h-[0.5px] bg-primary-gray"></span>
            <p className="w-fit">Or, Log in with </p>
            <span className="w-16 h-[0.5px] bg-primary-gray"></span>
          </div>

          <div className="flex-col gap-y-2">

            <div className="space-y-4 w-full">
              <button onClick={GoogleLogin} type="button" className="flex items-center gap-x-2 justify-center border border-gray-200 rounded-full px-4 py-2.5 hover:bg-zinc-50 hover:border-primary-black transition-colors duration-300 w-full shadow-xs cursor-pointer">
                <Image
                  src={googleIcon}
                  alt="apple_icon"
                  className="size-5 cursor-pointer"
                ></Image>
                <p className="text-base font-medium">Continue with Google</p>
              </button>
              <button onClick={AppleLogin} type="button" className="flex items-center gap-x-2 justify-center border border-gray-200 rounded-full px-4 py-2.5 hover:bg-zinc-50 hover:border-primary-black transition-colors duration-300 w-full shadow-xs cursor-pointer">
                <Image
                  src={appleIcon}
                  alt="apple_icon"
                  className="size-6 cursor-pointer"
                ></Image>
                <p className="text-base font-medium">Continue with Apple</p>
              </button>

            </div>
          </div>
        </>)}

      </CardContent>

    </Card>
  );
};

export default SignUpForm;
