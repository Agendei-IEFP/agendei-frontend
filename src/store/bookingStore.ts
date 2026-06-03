import { create } from "zustand";
import type { OfferingDTO, StoreProfessionalDTO } from "@/types/api";

interface BookingState {
  open: boolean;
  step: 1 | 2 | 3 | "auth" | "success";
  storeId: string | null;
  professionalStoreId: string | null;
  selectedProfessional: StoreProfessionalDTO | null;
  offeringId: string | null;
  selectedOffering: OfferingDTO | null;
  date: string;
  slot: { start: string; end: string } | null;
  notes: string;

  openWizard: (opts?: {
    storeId?: string;
    professionalStoreId?: string;
    professional?: StoreProfessionalDTO;
  }) => void;
  closeWizard: () => void;
  setOffering: (offering: OfferingDTO) => void;
  setProfessional: (professionalStoreId: string, professional: StoreProfessionalDTO) => void;
  setDate: (date: string) => void;
  setSlot: (slot: { start: string; end: string }) => void;
  setNotes: (notes: string) => void;
  goStep: (step: 1 | 2 | 3 | "auth" | "success") => void;
  reset: () => void;
}

const initialSelections = {
  step: 1 as const,
  storeId: null,
  professionalStoreId: null,
  selectedProfessional: null,
  offeringId: null,
  selectedOffering: null,
  date: "",
  slot: null,
  notes: "",
};

export const useBookingStore = create<BookingState>()((set) => ({
  open: false,
  ...initialSelections,

  openWizard: (opts) =>
    set((s) => ({
      open: true,
      step: 1,
      storeId: opts?.storeId ?? s.storeId,
      professionalStoreId: opts?.professionalStoreId ?? null,
      selectedProfessional: opts?.professional ?? null,
      offeringId: null,
      selectedOffering: null,
      date: "",
      slot: null,
      notes: "",
    })),

  closeWizard: () =>
    set({
      open: false,
      ...initialSelections,
    }),

  setOffering: (offering) =>
    set({
      offeringId: offering.id,
      selectedOffering: offering,
      date: "",
      slot: null,
    }),

  setProfessional: (professionalStoreId, professional) =>
    set({
      professionalStoreId,
      selectedProfessional: professional,
      offeringId: null,
      selectedOffering: null,
      date: "",
      slot: null,
    }),

  setDate: (date) => set({ date, slot: null }),

  setSlot: (slot) => set({ slot }),

  setNotes: (notes) => set({ notes }),

  goStep: (step) => set({ step }),

  reset: () => set({ ...initialSelections }),
}));
