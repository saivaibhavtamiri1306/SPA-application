import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Lang = 'en' | 'te' | 'hi';

const DICT: Record<Lang, Record<string, string>> = {
  en: {
    dash: 'Command Center', vault: 'Data Vault', users: 'Manage Users', audit: 'Audit Ledger', pipeline: 'Verification Pipeline', logout: 'Terminate Session',
    loginId: 'Operator ID', loginKey: 'Security Key', loginRole: 'Access Role', loginBtn: 'Initialize Connection', demo: 'Demo Access',
    warning: 'This is a demonstration environment. All records are fictional and no real personal data is used.',
    mfa: 'Two-Factor Verification', mfaSub: 'Enter the 6-digit code to continue.',
  },
  te: {
    dash: 'కమాండ్ సెంటర్', vault: 'డేటా వాల్ట్', users: 'వినియోగదారుల నిర్వహణ', audit: 'ఆడిట్ లెడ్జర్', pipeline: 'వెరిఫికేషన్ పైప్‌లైన్', logout: 'సెషన్ ముగించండి',
    loginId: 'ఆపరేటర్ ID', loginKey: 'సెక్యూరిటీ కీ', loginRole: 'యాక్సెస్ పాత్ర', loginBtn: 'కనెక్షన్ ప్రారంభించండి', demo: 'డెమో యాక్సెస్',
    warning: 'ఇది ఒక డెమో వాతావరణం. అన్ని రికార్డులు కల్పితం; నిజమైన వ్యక్తిగత డేటా ఉపయోగించలేదు.',
    mfa: 'రెండు-దశల ధృవీకరణ', mfaSub: 'కొనసాగడానికి 6 అంకెల కోడ్ నమోదు చేయండి.',
  },
  hi: {
    dash: 'कमांड सेंटर', vault: 'डेटा वॉल्ट', users: 'उपयोगकर्ता प्रबंधन', audit: 'ऑडिट लेजर', pipeline: 'सत्यापन पाइपलाइन', logout: 'सेशन समाप्त करें',
    loginId: 'ऑपरेटर ID', loginKey: 'सिक्योरिटी की', loginRole: 'एक्सेस भूमिका', loginBtn: 'कनेक्शन शुरू करें', demo: 'डेमो एक्सेस',
    warning: 'यह एक डेमो वातावरण है। सभी रिकॉर्ड काल्पनिक हैं और वास्तविक व्यक्तिगत डेटा का उपयोग नहीं हुआ है।',
    mfa: 'दो-चरणीय सत्यापन', mfaSub: 'जारी रखने के लिए 6 अंकों का कोड दर्ज करें।',
  }
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly langSubject = new BehaviorSubject<Lang>((localStorage.getItem('tv_lang') as Lang) || 'en');
  readonly language$ = this.langSubject.asObservable();
  get language(): Lang { return this.langSubject.value; }
  setLanguage(lang: Lang): void { this.langSubject.next(lang); localStorage.setItem('tv_lang', lang); }
  t(key: string): string { return DICT[this.language][key] ?? DICT.en[key] ?? key; }
}
