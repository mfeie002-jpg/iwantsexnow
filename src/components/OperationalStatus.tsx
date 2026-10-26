import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
export function OperationalStatus({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return <div className="min-h-screen bg-[#13161C] text-white"><SEO title={title + " | iwantsexnow.ch"} noindex /><LuxuryHeader />
    <main className="mx-auto max-w-3xl px-6 py-14 space-y-5"><h1 className="text-3xl font-serif">{title}</h1>
    {paragraphs.map(text => <p key={text} className="text-gray-300 leading-relaxed">{text}</p>)}</main><CorporateFooter /></div>;
}
