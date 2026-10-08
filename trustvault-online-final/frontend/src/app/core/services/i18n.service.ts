import { Injectable, signal } from '@angular/core';

type Lang = 'en' | 'te' | 'hi';
const DICT: Record<Lang, Record<string, string>> = {
  en: {
    dashboard:'Command Center', records:'Data Vault', users:'Manage Users', pipeline:'Verification Pipeline', audit:'Audit Ledger', logout:'Terminate Session',
    welcome:'Welcome back', fetch:'Fetch Records', search:'Search assets...', register:'Register Operator', admin:'ADMIN', user:'GENERAL USER'
  },
  te: {
    dashboard:'కమాండ్ సెంటర్', records:'డేటా వాల్ట్', users:'వినియోగదారుల నిర్వహణ', pipeline:'వెరిఫికేషన్ పైప్‌లైన్', audit:'ఆడిట్ లెడ్జర్', logout:'సెషన్ ముగించండి',
    welcome:'మళ్లీ స్వాగతం', fetch:'రికార్డులు తీసుకురా', search:'రికార్డులను వెతకండి...', register:'ఆపరేటర్‌ను నమోదు చేయి', admin:'అడ్మిన్', user:'జనరల్ యూజర్'
  },
  hi: {
    dashboard:'कमांड सेंटर', records:'डेटा वॉल्ट', users:'उपयोगकर्ता प्रबंधन', pipeline:'सत्यापन पाइपलाइन', audit:'ऑडिट लेजर', logout:'सेशन समाप्त करें',
    welcome:'वापसी पर स्वागत है', fetch:'रिकॉर्ड लाएँ', search:'रिकॉर्ड खोजें...', register:'ऑपरेटर पंजीकृत करें', admin:'एडमिन', user:'सामान्य उपयोगकर्ता'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>((localStorage.getItem('tv_lang') as Lang) || 'en');
  setLang(value: Lang): void { localStorage.setItem('tv_lang', value); this.lang.set(value); }
  t(key: string): string { return DICT[this.lang()][key] ?? DICT.en[key] ?? key; }
}
