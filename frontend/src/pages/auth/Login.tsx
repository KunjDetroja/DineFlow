import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validator/login.validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { useLoginMutation } from "@/store/services/auth.service";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "../../validator/login.validator";

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    try {
      const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
      if (accounts.length > 0) {
        const mostRecentAccount = accounts[accounts.length - 1];
        form.reset({
          email: mostRecentAccount.email,
          password: mostRecentAccount.password,
        });
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error parsing localStorage accounts:", error);
    }
  }, [form]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const email = e.target.value;
    field.onChange(email);
    try {
      const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchingAccount = accounts.find((acc: any) => acc.email === email);
      if (matchingAccount) {
        form.setValue("password", matchingAccount.password);
        setRememberMe(true);
      } else {
        form.setValue("password", "");
        setRememberMe(false);
      }
    } catch (error) {
      console.error("Error parsing localStorage accounts:", error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const newPassword = e.target.value;
    field.onChange(newPassword);
    setIsTypingPassword(true);
    const isValid = validatePassword(newPassword, setPasswordErrors);
    if (isValid) {
      setIsTypingPassword(false);
    }
  };

  async function onSubmit(data: { email: string; password: string }) {
    try {
      const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
      const existingIndex = accounts.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: any) => acc.email === data.email
      );

      if (rememberMe) {
        if (existingIndex !== -1) {
          accounts[existingIndex].password = data.password;
        } else {
          accounts.push({
            email: data.email,
            password: data.password,
          });
        }
        localStorage.setItem("accounts", JSON.stringify(accounts));
        localStorage.setItem("rememberMe", "true");
      } else {
        if (existingIndex !== -1) {
          accounts.splice(existingIndex, 1);
        }
        localStorage.setItem("accounts", JSON.stringify(accounts));
        localStorage.removeItem("rememberMe");
      }

      const response = await login(data).unwrap();
      toast.success(response.message || "Login successful");
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div
            className="mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-primary"
          >
            <span className="font-bold text-white text-lg">D</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            DineFlow
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access DineFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          {...field}
                          onChange={(e) => handleEmailChange(e, field)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            placeholder="••••••••"
                            {...field}
                            onChange={(e) => handlePasswordChange(e, field)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    id="remember-me"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
