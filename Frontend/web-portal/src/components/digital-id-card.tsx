
"use client";

import { DigitalIdSerializable } from "@/lib/digital-id";
import { BadgeCheck, Fingerprint, QrCode } from "lucide-react";

export function DigitalIdCard({ digitalId }: { digitalId: DigitalIdSerializable }) {
    const issuedDate = new Date(digitalId.issuedAt).toLocaleDateString();
    const validUntilDate = new Date(digitalId.validUntil).toLocaleDateString();

    return (
        <div className="font-sans max-w-lg mx-auto bg-gradient-to-br from-blue-100 via-white to-cyan-100 rounded-2xl shadow-lg p-6 border border-gray-200">
            <header className="flex items-center justify-between pb-4 border-b-2 border-gray-300/50">
                <div className="flex items-center gap-3">
                    <Fingerprint className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 font-headline">Digital Tourist ID</h1>
                        <p className="text-xs text-gray-500">Smart Tourist Safety</p>
                    </div>
                </div>
                <BadgeCheck className="w-10 h-10 text-green-600" />
            </header>

            <main className="grid grid-cols-3 gap-6 py-6">
                <div className="col-span-1 flex items-center justify-center">
                    <div className="w-28 h-28 bg-gray-200 rounded-md flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-gray-700" />
                    </div>
                </div>
                <div className="col-span-2 space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Full Name</p>
                        <p className="text-lg font-medium text-gray-900">{digitalId.fullName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Nationality</p>
                        <p className="text-lg font-medium text-gray-900">{digitalId.nationality}</p>
                    </div>
                </div>
            </main>

            <section className="space-y-4 pt-4 border-t border-gray-300/50 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Document Type</p>
                        <p className="font-medium text-gray-800">{digitalId.documentType}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Document Number</p>
                        <p className="font-mono text-gray-800 tracking-wider">{digitalId.documentNumber}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Issued On</p>
                        <p className="font-medium text-gray-800">{issuedDate}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Valid Until</p>
                        <p className="font-medium text-red-600">{validUntilDate}</p>
                    </div>
                </div>
                 <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                    <p className="font-medium text-green-700">{digitalId.status}</p>
                </div>
            </section>
        </div>
    );
}
