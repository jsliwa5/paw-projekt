import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Loader2, UserPlus } from "lucide-react";
import { registerSchema, type RegisterInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "USER",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      toast({
        title: "Konto utworzone!",
        description: "Zaloguj się używając nowego konta.",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Błąd rejestracji",
        description: error instanceof Error ? error.message : "Coś poszło nie tak",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              Stwórz konto
            </CardTitle>
            <CardDescription className="text-center">
              Wprowadź swoje dane aby rozpocząć
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imię</FormLabel>
                          <FormControl>
                            <Input
                                type="text"
                                placeholder="Wpisz swoje imię"
                                data-testid="input-name"
                                {...field}
                            />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                                type="email"
                                placeholder="Wpisz swój email"
                                data-testid="input-email"
                                {...field}
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
                          <FormLabel>Hasło</FormLabel>
                          <FormControl>
                            <Input
                                type="password"
                                placeholder="Stwórz hasło"
                                data-testid="input-password"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                {/* --- NOWE POLE ROLI --- */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rola</FormLabel>
                          <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-role">
                                <SelectValue placeholder="Wybierz rolę" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USER">Użytkownik (User)</SelectItem>
                              <SelectItem value="MANAGER">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                {/* ---------------------- */}

              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-register"
                >
                  {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Zarejestruj się
                      </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Masz już konto?{" "}
                  <Link
                      href="/login"
                      className="text-foreground font-medium hover:underline"
                      data-testid="link-login"
                  >
                    Zaloguj się
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
  );
}