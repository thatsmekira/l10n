import { Inject, Injectable } from '@angular/core';
import { TranslocoService, getBrowserCultureLang } from '@ngneat/transloco';
import {
    DateFormatter,
    KBQ_LOCALE_SERVICE,
    KbqLocaleService,
} from '@koobiq/components/core';
import {DateTime, Settings} from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { Locale, AVAILABLE_LOCALES, DEFAULT_LOCALE } from './i18n-config';


/**
 * Service for getting current locale and changing it
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
    currentLang = new BehaviorSubject<string>(this.currentLocale);

    get shortLocale(): string {
        return this.currentLocale.split('-').shift() as string;
    }

    get currentLocale(): Locale {
        return this._currentLocale;
    }

    set currentLocale(locale: Locale) {
        this._currentLocale = this.isAvailableLocale(locale)
            ? locale
            : DEFAULT_LOCALE;

        this.currentLang.next(this._currentLocale.split('-')[0]);

        window.localStorage.setItem('locale', this._currentLocale);
        this.dateFormatter.setLocale(this.currentLocale);
        this.kbqLocaleService.setLocale(this.currentLocale);
        Settings.defaultLocale = this.shortLocale;

        this.translocoService.setActiveLang(this._currentLocale);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _currentLocale: Locale;

    constructor(
        @Inject(KBQ_LOCALE_SERVICE) private readonly kbqLocaleService: KbqLocaleService,
        private translocoService: TranslocoService,
        private dateFormatter: DateFormatter<DateTime>
    ) {
        this.setDefaultLocale();
    }

    setDefaultLocale(default_locale?: Locale) {
        if (!window.localStorage.getItem('locale') && default_locale) {
            this.currentLocale = default_locale;
        } else {
            this.currentLocale =
                (window.localStorage.getItem('locale') || getBrowserCultureLang()) as Locale;
        }
    }

    private isAvailableLocale(locale: string): boolean {
        return (
            AVAILABLE_LOCALES.find(
                (availableLocale) => availableLocale === locale
            ) !== undefined
        );
    }
}
