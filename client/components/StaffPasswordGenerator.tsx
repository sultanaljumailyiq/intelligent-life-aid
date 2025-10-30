import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Copy, Mail, RefreshCw, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface StaffPasswordGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: { id: string; name: string; email?: string } | null;
  onPasswordGenerated?: (staffId: string, password: string) => Promise<void>;
}

export function StaffPasswordGenerator({ open, onOpenChange, staff, onPasswordGenerated }: StaffPasswordGeneratorProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendToEmail, setSendToEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState("");

  const generateSecurePassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    const allChars = uppercase + lowercase + numbers + symbols;
    const length = 16;
    let pwd = "";

    // Ensure at least one of each type
    pwd += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    pwd += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));

    // Fill remaining with random characters
    for (let i = pwd.length; i < length; i++) {
      pwd += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle password
    return pwd
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleGeneratePassword = () => {
    setIsGenerating(true);
    try {
      const newPassword = generateSecurePassword();
      setPassword(newPassword);
      setIsCopied(false);
      toast({
        title: "تم إنشاء كلمة السر",
        description: "تم إنشاء كلمة سر جديدة بنجاح",
      });
    } catch (error) {
      console.error("Failed to generate password:", error);
      toast({
        title: "خطأ",
        description: "فشل إنشاء كلمة السر",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      toast({
        title: "تم النسخ",
        description: "تم نسخ كلمة السر إلى الحافظة",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSendEmail = async () => {
    if (!staff || !password) return;

    const emailToSend = customEmail || staff.email;
    if (!emailToSend) {
      toast({
        title: "خطأ",
        description: "لا توجد عنوان بريد إلكتروني للموظف",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Call API to send password via email
      const response = await fetch(`/api/staff/${staff.id}/send-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          email: emailToSend,
        }),
      });

      if (!response.ok) throw new Error("Failed to send password");

      // Call callback if provided
      if (onPasswordGenerated) {
        await onPasswordGenerated(staff.id, password);
      }

      toast({
        title: "تم الإرسال",
        description: `تم إرسال كلمة السر إلى ${emailToSend}`,
      });

      // Clear password and close
      setPassword("");
      setSendToEmail(false);
      setCustomEmail("");
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      console.error("Failed to send password:", error);
      toast({
        title: "خطأ",
        description: "فشل إرسال كلمة السر",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSavePassword = async () => {
    if (!staff || !password) return;

    setIsSending(true);
    try {
      // Call API to save/update password
      const response = await fetch(`/api/staff/${staff.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) throw new Error("Failed to save password");

      // Call callback if provided
      if (onPasswordGenerated) {
        await onPasswordGenerated(staff.id, password);
      }

      toast({
        title: "تم الحفظ",
        description: "تم حفظ كلمة السر الجديدة",
      });

      // Clear password and close
      setPassword("");
      setSendToEmail(false);
      setCustomEmail("");
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      console.error("Failed to save password:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ كلمة السر",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء كلمة سر للموظف</DialogTitle>
          <DialogDescription>{staff.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">ملاحظة أمنية</div>
              <div>سيتم عرض كلمة السر مرة واحدة فقط. تأكد من نسخها أو إرسالها للموظف على الفور.</div>
            </div>
          </div>

          {/* Password Display */}
          {password ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">كلمة السر المُنشأة</label>
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-300">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="flex-1 bg-transparent font-mono text-sm text-gray-900 outline-none"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title={showPassword ? "إخفاء" : "عرض"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopyPassword}
                  className={cn(
                    "p-1 rounded transition-colors",
                    isCopied ? "bg-green-100 text-green-700" : "hover:bg-gray-200"
                  )}
                  title="نسخ"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength indicator */}
              <div className="text-xs text-gray-600">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                كلمة سر قوية (16 حرف)
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-gray-600">
              انقر على "إنشاء كلمة سر" لإنشاء كلمة سر جديدة
            </div>
          )}

          {/* Send to Email Option */}
          {password && (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToEmail}
                  onChange={(e) => setSendToEmail(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">إرسال عبر البريد الإلكتروني</span>
              </label>

              {sendToEmail && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">عنوان البريد الإلكتروني</label>
                  <Input
                    type="email"
                    placeholder={staff.email || "البريد الإلكتروني"}
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-600">
                    سيتم إرسال كلمة السر إلى هذا البريد الإلكتروني
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>

          {!password ? (
            <Button onClick={handleGeneratePassword} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إنشاء كلمة سر
                </>
              )}
            </Button>
          ) : (
            <>
              {sendToEmail ? (
                <Button onClick={handleSendEmail} disabled={isSending || !customEmail}>
                  {isSending ? (
                    <>
                      <Mail className="w-4 h-4 mr-2 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      إرسال البريد
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleSavePassword} disabled={isSending}>
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ كلمة السر"
                  )}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
