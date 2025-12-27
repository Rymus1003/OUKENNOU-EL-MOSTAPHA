
import React from 'react';

interface WhatsAppNotifierProps {
  clientName: string;
  phone: string;
  hearingDate: string;
  court: string;
  caseNumber: string;
}

const WhatsAppNotifier: React.FC<WhatsAppNotifierProps> = ({ clientName, phone, hearingDate, court, caseNumber }) => {
  const generateMessage = () => {
    const date = new Date(hearingDate);
    const dateStr = date.toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeStr = date.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });
    
    const message = `السلام عليكم السيد(ة) ${clientName}،
نود تذكيركم بموعد جلستكم القادمة:
📅 التاريخ: ${dateStr}
⏰ الساعة: ${timeStr}
🏛️ المحكمة: ${court}
📁 ملف رقم: ${caseNumber}

يرجى الحضور في الموعد المحدد.
بالتوفيق، مكتب المحامي برو.`;

    return encodeURIComponent(message);
  };

  const handleSend = () => {
    // تنظيف رقم الهاتف المغربي
    let cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '212' + cleanPhone.substring(1);
    }
    
    window.open(`https://wa.me/${cleanPhone}?text=${generateMessage()}`, '_blank');
  };

  return (
    <button 
      onClick={handleSend}
      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-md active:scale-95"
      title="إرسال تذكير عبر واتساب"
    >
      <i className="fa-brands fa-whatsapp text-lg"></i>
      تذكير واتساب
    </button>
  );
};

export default WhatsAppNotifier;
