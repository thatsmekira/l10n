import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
    NgModule,
    ModuleWithProviders, APP_INITIALIZER
} from '@angular/core';
import {
    TranslocoModule,
    TRANSLOCO_LOADER,
    TRANSLOCO_CONFIG,
    TranslocoConfig,
    translocoConfig, TranslocoService
} from '@ngneat/transloco';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';
import { Observable } from 'rxjs';

import { defaultTranslocoConfig, AVAILABLE_LOCALES } from './i18n-config';
import { TRANSLATION_CACHE_KEY, TranslocoHttpLoader } from './transloco-http-loader';
import { KBQ_DATE_FORMATS, KBQ_DATE_LOCALE, KBQ_LOCALE_SERVICE, KbqLocaleService } from '@koobiq/components/core';
import { KBQ_LUXON_DATE_ADAPTER_OPTIONS, KBQ_LUXON_DATE_FORMATS } from '@koobiq/angular-luxon-adapter/adapter';
import { DateAdapter } from '@koobiq/date-adapter';
import { LuxonDateAdapter } from '@koobiq/luxon-date-adapter';


function initializeAppFactory(transloco: TranslocoService): () => Observable<any> {
    return () => transloco.load(transloco.getActiveLang());
}

@NgModule({
    imports: [
        HttpClientModule,
        TranslocoModule,
        TranslocoMessageFormatModule.forRoot({ locales: AVAILABLE_LOCALES }),
        CommonModule
    ],
    declarations: [],
    exports: [TranslocoModule]
})
export class I18nModule {
    static forRoot(
        config: Partial<TranslocoConfig> = {},
        cacheKey: string
    ): ModuleWithProviders<I18nModule> {
        return {
            ngModule: I18nModule,
            providers: [
                {
                    provide: TRANSLOCO_CONFIG,
                    useValue: translocoConfig({
                        ...defaultTranslocoConfig,
                        ...config
                    })
                },
                {
                    provide: TRANSLATION_CACHE_KEY,
                    useValue: cacheKey
                },
                {
                    provide: TRANSLOCO_LOADER,
                    useClass: TranslocoHttpLoader,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initializeAppFactory,
                    deps: [TranslocoService],
                    multi: true
                },
                {
                    provide: KBQ_DATE_FORMATS,
                    useValue: KBQ_LUXON_DATE_FORMATS
                },
                {
                    provide: DateAdapter,
                    useClass: LuxonDateAdapter,
                    deps: [KBQ_DATE_LOCALE, KBQ_LUXON_DATE_ADAPTER_OPTIONS, KBQ_LOCALE_SERVICE]
                },
                { provide: KBQ_LOCALE_SERVICE, useClass: KbqLocaleService }
            ]
        };
    }
}
