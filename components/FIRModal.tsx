"use client";

interface FIRModalProps {
  onDismiss: () => void;
}

export default function FIRModal({ onDismiss }: FIRModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-cell/95 flex items-center justify-center p-6">
      <div className="max-w-[520px] w-full bg-cell border-2 border-alarm p-6 md:p-8 font-space text-sm">
        <div className="text-alarm text-[10px] tracking-[3px] mb-6">
          FIRST INFORMATION REPORT — SECTION 154 Cr.P.C.
        </div>
        <div className="text-chalk text-xs leading-[2] mb-6 space-y-3">
          <p>FIR No: ___/2025</p>
          <p>Date: 08.02.2025</p>
          <p>Sections: BNS 79, 95, 196, 294, 296, 299 · IT Act 67</p>
          <p>Accused: Samay Raina, Comedian</p>
          <p className="text-dim mt-4">
            &ldquo;I had killed 99% of the germs. I didn&apos;t know the pandemic would happen from that 1%.&rdquo;
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-alarm text-white font-space text-xs tracking-[2px] hover:brightness-110 transition-all"
        >
          DISMISS FIR
        </button>
      </div>
    </div>
  );
}
