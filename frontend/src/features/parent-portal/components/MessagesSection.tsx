import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  Check, 
  CheckCheck,
  Lock,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotification } from '../../../context/NotificationContext';

export const MessagesSection = () => {
  const { showNotification } = useNotification();
  const [activeChat, setActiveChat] = useState<'admin' | 'teacher' | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any>({
    teacher: [
      { id: 1, type: 'received', text: 'Assalomu alaykum, Iskandar aka. Mustafoning bugungi mashg\'ulotlardagi ishtiroki juda yaxshi bo\'ldi.', time: '10:30', status: 'read' },
      { id: 2, type: 'sent', text: 'Vaalaykum assalom, ustoz. Rahmat, xursandmiz. Bugun ingliz tilidan yangi so\'zlarni yodladimi?', time: '11:15', status: 'read' },
      { id: 3, type: 'received', text: 'Ha, mevalar mavzusini to\'liq o\'zlashtirdi. Hozirda rasm chizish darsida qatnashmoqda.', time: '11:20', status: 'read' }
    ],
    admin: [
      { id: 1, type: 'received', text: 'Hurmatli ota-onalar, 1-may kuni bog\'chamizda "Bahor bayrami" tadbiri bo\'lib o\'tadi.', time: '09:00', status: 'read' },
      { id: 2, type: 'sent', text: 'Tushunarli, rahmat. Tadbir soat nechada boshlanadi?', time: '09:45', status: 'read' }
    ]
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      type: 'sent',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages((prev: any) => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMessage]
    }));
    
    setChatMessage('');
    showNotification('Xabar yuborildi', 'success');
  };

  const getContactName = (chatId: 'teacher' | 'admin') => {
    return chatId === 'teacher' ? 'Tarbiyachi' : 'Ma\'muriyat';
  };

  return (
    <div className="h-[600px] md:h-[700px] flex flex-col md:flex-row gap-6">
      {/* Contact List */}
      <div className={`
        ${activeChat && 'hidden md:flex'} 
        w-full md:w-80 flex-col gap-4 transition-all duration-500
      `}>
        <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-brand-border shadow-sm space-y-3">
            <p className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] px-2">Kontaktlar</p>
            <div className="space-y-2">
            {['teacher', 'admin'].map((chatId: any) => (
                <button 
                  key={chatId}
                  onClick={() => setActiveChat(chatId)}
                  className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-[1.5rem] transition-all text-left bg-slate-50 border border-slate-100 hover:border-brand-primary`}
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-white border-2 border-brand-border text-brand-primary shrink-0">
                      {chatId === 'teacher' ? <User size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs font-black leading-none uppercase tracking-wider">{getContactName(chatId)}</p>
                      <p className="text-[8px] md:text-[9px] mt-1 font-bold uppercase tracking-widest text-emerald-500">Online</p>
                    </div>
                </button>
            ))}
            </div>
        </div>
        <div className="hidden md:flex bg-brand-ghost p-6 rounded-[2.5rem] border border-brand-border flex-1 flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner opacity-40"><Lock size={24} /></div>
            <p className="text-[9px] font-black text-brand-muted uppercase leading-relaxed px-4 tracking-widest">Shifrlangan xabarlar</p>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`
        ${!activeChat && 'hidden md:flex'}
        flex-1 bg-white border-2 border-slate-50 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] shadow-2xl flex flex-col relative overflow-hidden transition-all duration-500
      `}>
        <AnimatePresence mode="wait">
          {!activeChat ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-10"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-ghost flex items-center justify-center border-4 border-slate-50 mb-6">
                <MessageCircle size={48} md:size={64} className="text-slate-300" />
              </div>
              <h4 className="text-xl md:text-2xl font-black text-brand-depth">Xabar yuborish</h4>
              <p className="text-sm md:text-base text-brand-muted mt-2 max-w-xs">Suhbatni boshlash uchun chap tarafdagi kontaktlardan birini tanlang.</p>
            </motion.div>
          ) : (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-4 md:p-6 lg:p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-brand-muted hover:text-brand-primary"><ArrowLeft size={20} /></button>
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                      {activeChat === 'teacher' ? <User size={20} md:size={28} /> : <ShieldCheck size={20} md:size={28} />}
                    </div>
                    <div>
                      <h5 className="text-base md:text-xl font-black text-brand-depth tracking-tight">{getContactName(activeChat)}</h5>
                      <div className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Tarmoqda
                      </div>
                    </div>
                </div>
                <button className="p-2 text-brand-muted hover:text-brand-primary transition-colors"><MoreVertical size={20} md:size={24} /></button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-4 md:space-y-6 relative z-10 custom-scrollbar">
                {messages[activeChat].map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[80%] p-4 md:p-5 rounded-2xl md:rounded-[2rem] shadow-lg relative group ${
                          msg.type === 'sent' 
                          ? 'bg-brand-primary text-white rounded-tr-none' 
                          : 'bg-slate-50 text-brand-depth rounded-tl-none border border-slate-100'
                      }`}>
                          <p className="text-xs md:text-sm font-bold leading-relaxed">{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1.5 mt-2 ${msg.type === 'sent' ? 'text-white/60' : 'text-brand-muted'}`}>
                            <span className="text-[8px] md:text-[9px] font-black">{msg.time}</span>
                            {msg.type === 'sent' && (
                                msg.status === 'read' ? <CheckCheck size={10} md:size={12} /> : <Check size={10} md:size={12} />
                            )}
                          </div>
                      </div>
                    </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 lg:p-8 border-t border-slate-50 bg-white/80 backdrop-blur-md relative z-10">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 md:gap-4 bg-slate-50 border-2 border-transparent focus-within:border-brand-primary focus-within:bg-white rounded-xl md:rounded-[2.5rem] px-4 md:px-8 py-2 md:py-4 transition-all shadow-inner"
                >
                    <button type="button" className="text-brand-muted hover:text-brand-primary transition-colors hidden md:block"><Paperclip size={22} /></button>
                    <input 
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Xabar..."
                      className="flex-1 bg-transparent outline-none font-bold text-xs md:text-sm text-brand-depth py-2"
                    />
                    <button type="button" className="text-brand-muted hover:text-brand-primary transition-colors hidden md:block"><Smile size={22} /></button>
                    <button 
                      type="submit"
                      className="w-10 h-10 md:w-12 md:h-12 bg-brand-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                    >
                      <Send size={18} md:size={20} />
                    </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
