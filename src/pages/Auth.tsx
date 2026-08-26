import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
import { TurnstileWidget } from "@/components/TurnstileWidget";

// Site key pública do Cloudflare Turnstile (não é segredo — é enviada ao
// navegador por design). A verificação real do token acontece no servidor,
// no Supabase Auth, usando a secret key configurada no Dashboard
// (Authentication → Providers → Email → Enable CAPTCHA protection).
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

const resetPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Código OTP deve ter 6 dígitos"),
});

enum AuthMode {
  LOGIN = "login",
  SIGNUP = "signup",
  FORGOT_PASSWORD = "forgot_password",
  TWO_FACTOR = "two_factor",
}

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const navigate = useNavigate();

  // Turnstile tokens só podem ser usados uma vez — depois de qualquer
  // tentativa (sucesso ou erro), força um novo desafio.
  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaResetKey((key) => key + 1);
  };

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === AuthMode.LOGIN) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: captchaToken ? { captchaToken } : undefined,
        });

        if (error) throw error;
        
        // Check if 2FA is enabled for this user
        const { data: twoFactorEnabled } = await supabase.rpc(
          'is_two_factor_enabled',
        );
        
        if (twoFactorEnabled) {
          // Send OTP email
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            }
          });
          
          if (otpError) throw otpError;
          
          setOtpEmail(email);
          setShowOtpDialog(true);
          setIsLoading(false);
          return;
        }
        
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else if (mode === AuthMode.SIGNUP) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
            ...(captchaToken ? { captchaToken } : {}),
          },
        });

        if (error) throw error;
        
        toast.success("Cadastro realizado com sucesso! Verifique seu email.");
        setMode(AuthMode.LOGIN);
      } else if (mode === AuthMode.FORGOT_PASSWORD) {
        // Reset password
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;
        
        toast.success("Instruções de redefinição de senha enviadas para seu email.");
        setMode(AuthMode.LOGIN);
      }
    } catch (error: unknown) {
      toast.error(`Erro: ${getErrorMessage(error) || "Ocorreu um erro"}`);
    } finally {
      setIsLoading(false);
      resetCaptcha();
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
        ...(captchaToken ? { captchaToken } : {}),
      });

      if (error) throw error;

      toast.success("Instruções de redefinição de senha enviadas para seu email.");
      setMode(AuthMode.LOGIN);
    } catch (error: unknown) {
      toast.error(`Erro: ${getErrorMessage(error) || "Ocorreu um erro"}`);
    } finally {
      setIsLoading(false);
      resetCaptcha();
    }
  };

  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: values.otp,
        type: 'email',
      });

      if (error) throw error;
      
      toast.success("Autenticação de dois fatores concluída com sucesso!");
      setShowOtpDialog(false);
      navigate("/");
    } catch (error: unknown) {
      toast.error(`Erro: ${getErrorMessage(error) || "Código OTP inválido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for reset password URL
  useEffect(() => {
    const checkForResetToken = async () => {
      const { data } = await supabase.auth.getSession();
      const hash = window.location.hash;
      
      if (hash && hash.includes('type=recovery')) {
        // Handle password reset
        const newPassword = prompt("Digite sua nova senha:");
        if (newPassword) {
          try {
            const { error } = await supabase.auth.updateUser({
              password: newPassword,
            });

            if (error) throw error;
            
            toast.success("Senha atualizada com sucesso. Faça login com sua nova senha.");
            navigate("/auth");
          } catch (error: unknown) {
            toast.error(`Erro: ${getErrorMessage(error) || "Ocorreu um erro"}`);
          }
        }
      }
    };
    
    checkForResetToken();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">BuddyDoctor</CardTitle>
          </div>
          <CardDescription>
            {mode === AuthMode.LOGIN && "Faça login na sua conta"}
            {mode === AuthMode.SIGNUP && "Crie sua conta"}
            {mode === AuthMode.FORGOT_PASSWORD && "Recupere sua senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === AuthMode.LOGIN || mode === AuthMode.SIGNUP ? (
            <form onSubmit={handleAuth} className="space-y-4">
              {mode === AuthMode.SIGNUP && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-left block" htmlFor="name">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === AuthMode.SIGNUP}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-left block" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-left block" htmlFor="password">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {mode === AuthMode.LOGIN && (
                <div className="text-right">
                  <Button
                    variant="link"
                    className="p-0 text-sm"
                    type="button"
                    onClick={() => {
                      resetCaptcha();
                      setMode(AuthMode.FORGOT_PASSWORD);
                    }}
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              )}

              {TURNSTILE_SITE_KEY && (
                <TurnstileWidget
                  siteKey={TURNSTILE_SITE_KEY}
                  resetKey={captchaResetKey}
                  onVerify={setCaptchaToken}
                  onExpire={() => setCaptchaToken(null)}
                />
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (Boolean(TURNSTILE_SITE_KEY) && !captchaToken)}
              >
                {isLoading
                  ? "Carregando..."
                  : mode === AuthMode.LOGIN
                  ? "Entrar"
                  : "Cadastrar"}
              </Button>
            </form>
          ) : mode === AuthMode.FORGOT_PASSWORD ? (
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <FormField
                  control={resetPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-left block">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {TURNSTILE_SITE_KEY && (
                  <TurnstileWidget
                    siteKey={TURNSTILE_SITE_KEY}
                    resetKey={captchaResetKey}
                    onVerify={setCaptchaToken}
                    onExpire={() => setCaptchaToken(null)}
                  />
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || (Boolean(TURNSTILE_SITE_KEY) && !captchaToken)}
                >
                  {isLoading ? "Enviando..." : "Enviar instruções de recuperação"}
                </Button>
              </form>
            </Form>
          ) : null}
        </CardContent>

        <CardFooter className="flex justify-center">
          {mode === AuthMode.LOGIN ? (
            <Button
              variant="link"
              onClick={() => {
                resetCaptcha();
                setMode(AuthMode.SIGNUP);
              }}
              className="text-sm"
              type="button"
            >
              Não tem uma conta? Cadastre-se
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={() => {
                resetCaptcha();
                setMode(AuthMode.LOGIN);
              }}
              className="text-sm"
              type="button"
            >
              Já tem uma conta? Faça login
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* 2FA OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificação de Dois Fatores</DialogTitle>
            <DialogDescription>
              Por favor, digite o código enviado para seu email {otpEmail}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4 py-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Verificar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
