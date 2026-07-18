"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

export default function SifarisPrintView() {
  const params = useParams()
  const [sifaris, setSifaris] = useState<any>(null)

  useEffect(() => {
    // Mock Sifaris Data with HTML content after placeholder replacement
    setSifaris({
      id: params.id,
      sifarisNumber: "LG-2081-082-SIF-0042",
      verificationCode: "VCODE-XYZ-9876",
      htmlContent: `
        <div style="font-size: 1.125rem; line-height: 1.8; text-align: justify; margin-top: 2rem;">
          <p>श्रीमान वडा अध्यक्ष ज्यू,<br/>वडा नं. ५, काठमाडौं महानगरपालिका।</p>
          <p style="text-align: center; font-weight: bold; margin: 2rem 0; font-size: 1.25rem; text-decoration: underline;">विषय: नागरिकता सिफारिस सम्बन्धमा।</p>
          <p>महोदय,</p>
          <p>उपरोक्त सम्बन्धमा मेरो नाम <strong>राम बहादुर थापा</strong> र मेरो बुवाको नाम <strong>हरि बहादुर थापा</strong> हो। मलाई नागरिकता प्रमाणपत्रको आवश्यकता परेकोले सिफारिस गरिदिनुहुन अनुरोध गर्दछु।</p>
          <div style="margin-top: 4rem; text-align: right;">
            <p>निवेदक,</p>
            <p><strong>राम बहादुर थापा</strong></p>
          </div>
        </div>
      `,
      isApproved: true,
      approvedBy: "वडा अध्यक्ष",
    })
  }, [params.id])

  if (!sifaris) return <div className="p-8 text-center">Loading Sifaris Document...</div>

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-[21cm] mb-4 flex justify-end gap-3 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="bg-white"><Printer className="w-4 h-4 mr-2" /> Print</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-lg print:shadow-none print:m-0 p-12 md:p-16 relative">
        
        {/* Official Letterhead Header */}
        <div className="flex justify-between items-center border-b-2 border-red-600 pb-6 mb-8 text-red-600">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-red-600">
             {/* Emulating Nepal Govt Logo */}
             <span className="text-xs text-center font-bold">नेपाल सरकार<br/>लोगो</span>
          </div>
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-red-600 leading-tight">काठमाडौं महानगरपालिका</h2>
            <h3 className="text-lg font-semibold mt-1">नगर कार्यपालिकाको कार्यालय</h3>
            <p className="text-sm mt-1">बागमती प्रदेश, नेपाल</p>
          </div>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

        {/* Dispatch & Date Section */}
        <div className="flex justify-between text-sm font-medium mb-8">
          <div>पत्र संख्या: २०८१/०८२<br/>चलानी नं: {sifaris.sifarisNumber}</div>
          <div>मिति: २०८१/०४/२८</div>
        </div>

        {/* Dynamic Body Content */}
        <div dangerouslySetInnerHTML={{ __html: sifaris.htmlContent }} />

        {/* Signatures & Footer Section */}
        <div className="absolute bottom-16 left-16 right-16">
          <div className="flex justify-between items-end">
            <div className="flex flex-col items-center">
              {/* QR Code for Online Verification */}
              <div className="p-2 border rounded-md bg-white">
                <QRCodeSVG value={`http://localhost:3000/verify?code=${sifaris.verificationCode}`} size={80} />
              </div>
              <span className="text-[10px] text-gray-500 mt-1">Scan to Verify</span>
            </div>

            {sifaris.isApproved && (
              <div className="flex flex-col items-center text-blue-800">
                <div className="border border-blue-300 bg-blue-50/50 rounded-md p-2 mb-2 w-48 text-center text-xs relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('/signature-watermark.png')] bg-repeat"></div>
                  <span className="block font-bold text-blue-700">Digitally Signed</span>
                  <span className="block text-gray-600">Approved by {sifaris.approvedBy}</span>
                  <span className="block text-gray-500 text-[10px] mt-1">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="border-t border-black w-48 text-center pt-1 font-bold">
                  अधिकृत हस्ताक्षर
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hide elements when printing using CSS print media query */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}} />
    </div>
  )
}
