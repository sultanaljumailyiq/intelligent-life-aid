import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sharedClinicData, Patient } from "@/services/sharedClinicData";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId?: string | null;
}

export default function AddPatientDialog({ open, onOpenChange, clinicId }: AddPatientDialogProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    gender: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("الاسم ورقم الهاتف مطلوبان");
      return;
    }
    setSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const payload: Omit<Patient, "id"> = {
        name: form.name,
        age: form.age ? parseInt(form.age) : 0,
        phone: form.phone,
        email: form.email,
        address: form.address,
        lastVisit: today,
        nextAppointment: null,
        treatment: "",
        status: "active",
        priority: "normal",
        totalVisits: 0,
        totalSpent: 0,
        notes: "",
        medicalHistory: [],
        gender: form.gender === "ذكر" ? "male" : form.gender === "أنثى" ? "female" : undefined,
      };

      await sharedClinicData.addPatient(payload);
      toast.success("تم إضافة المريض بنجاح");
      onOpenChange(false);
      setForm({ name: "", phone: "", email: "", address: "", age: "", gender: "" });
    } catch (err) {
      console.error(err);
      toast.error("فشل إضافة المريض");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[60] max-w-2xl">
        <DialogHeader>
          <DialogTitle>إضافة مريض جديد{clinicId ? ` — عيادة ${clinicId}` : ""}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "جارٍ الحفظ..." : "حفظ"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
