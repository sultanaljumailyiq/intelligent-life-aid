import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sharedClinicData, Appointment } from "@/services/sharedClinicData";
import { useAuth } from "@/contexts/AuthContext";

interface AddReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId?: string | null;
}

export default function AddReservationDialog({ open, onOpenChange, clinicId }: AddReservationDialogProps) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    treatment: "",
    notes: "",
    duration: "30",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.date || !form.time) {
      toast.error("اسم المريض، التاريخ والوقت مطلوبة");
      return;
    }
    setSubmitting(true);
    try {
      const payload: Omit<Appointment, "id"> = {
        patientId: "",
        patientName: form.patientName,
        date: form.date,
        time: form.time,
        duration: parseInt(form.duration || "30"),
        treatment: form.treatment || "",
        doctorId: user?.id || "doc1",
        doctorName: user?.name || "غير محدد",
        status: "scheduled",
        notes: form.notes || undefined,
      };
      await sharedClinicData.addAppointment(payload);
      toast.success("تم إنشاء الحجز بنجاح");
      onOpenChange(false);
      setForm({ patientName: "", date: "", time: "", treatment: "", notes: "", duration: "30" });
    } catch (err) {
      console.error(err);
      toast.error("فشل إنشاء الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[60] max-w-2xl">
        <DialogHeader>
          <DialogTitle>حجز جديد{clinicId ? ` — عيادة ${clinicId}` : ""}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">اسم المريض</Label>
              <Input id="patientName" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="treatment">العلاج</Label>
              <Input id="treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="time">الوقت</Label>
              <Input id="time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="duration">المدة (دقيقة)</Label>
              <Input id="duration" type="number" min={5} step={5} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "جارٍ الحفظ..." : "إنشاء"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
