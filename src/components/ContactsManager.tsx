import React, { useState } from 'react';
import { EmergencyContact, LatLng } from '../types/safetrip';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  Star,
  MessageSquare
} from 'lucide-react';

interface ContactsManagerProps {
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  currentPosition: LatLng;
  onClose?: () => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({
  contacts,
  onUpdateContacts,
  currentPosition,
  onClose
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [testSentId, setTestSentId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      relationship: relationship.trim() || 'Trusted Contact',
      isPrimary: contacts.length === 0,
      autoNotify: true
    };

    onUpdateContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setRelationship('');
  };

  const handleDelete = (id: string) => {
    onUpdateContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    onUpdateContacts(
      contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id
      }))
    );
  };

  const handleToggleAutoNotify = (id: string) => {
    onUpdateContacts(
      contacts.map((c) => ({
        ...c,
        autoNotify: c.id === id ? !c.autoNotify : c.autoNotify
      }))
    );
  };

  const handleSendTestPing = (contact: EmergencyContact) => {
    const mapsLink = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;
    const text = encodeURIComponent(
      `🛡️ SafeTrip SOS Test Ping 🛡️\nHi ${contact.name}, this is a test message confirming you are listed as my emergency guardian on SafeTrip SOS.\nIn case of travel danger or route stray, you will automatically receive my live GPS coordinates (${mapsLink}).`
    );
    const cleanPhone = (contact.whatsapp || contact.phone).replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    setTestSentId(contact.id);
    setTimeout(() => setTestSentId(null), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-slate-800 p-4 sm:p-6 overflow-y-auto scroll-smooth font-sans rounded-2xl border border-slate-300/80 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/80 shadow-xs">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Emergency Contacts & Guardian Network
            </h2>
            <p className="text-xs text-slate-500">
              Trusted guardians who automatically receive your live route telemetry and WhatsApp emergency pings.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Back to Cockpit
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto w-full pb-10">
        {/* Left 2 Cols: Active Contacts List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Guardians ({contacts.length})
            </span>
            <span className="text-[11px] text-slate-500">
              Stage 2 notifies Primary · Stage 3 broadcasts to all
            </span>
          </div>

          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 rounded-xl border transition-all duration-200 hover-lift flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                contact.isPrimary
                  ? 'bg-white border-emerald-500 ring-1 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{contact.name}</h4>
                  {contact.isPrimary ? (
                    <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      Primary Guardian
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(contact.id)}
                      className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer"
                    >
                      Set As Primary
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-800">{contact.phone}</span>
                  <span>·</span>
                  <span className="font-medium text-slate-600">{contact.relationship}</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={contact.autoNotify}
                      onChange={() => handleToggleAutoNotify(contact.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Auto-notify on departure</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSendTestPing(contact)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Send test WhatsApp alert draft"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  <span>{testSentId === contact.id ? 'Test Sent' : 'WhatsApp Ping'}</span>
                </button>

                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-colors"
                  title="Call contact"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                {!contact.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Add New Guardian Form */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Add Emergency Contact
          </span>

          <form
            onSubmit={handleAdd}
            className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs"
          >
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pooja Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Phone Number (with Country Code)
              </label>
              <input
                type="text"
                required
                placeholder="+91 98201 23456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Relationship
              </label>
              <input
                type="text"
                placeholder="e.g. Sister, Father, Mother, Flatmate"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Enroll Guardian</span>
            </button>
          </form>

          {/* Quick Help Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 shadow-xs">
            <span className="font-bold text-slate-900 block uppercase tracking-wider">How Escalation Works</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When a route deviation, prolonged stop, or voice trigger occurs:
            </p>
            <ul className="text-[11px] space-y-1.5 list-disc list-inside text-slate-600">
              <li>0–30s: Discreet check-in prompt on phone</li>
              <li>30s: Primary Contact receives WhatsApp draft with live GPS</li>
              <li>60s: All enrolled contacts & 112 helpline broadcasted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
