import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
    DateAdapter,
    DateFormatter,
    KBQ_DATE_LOCALE,
} from '@koobiq/components/core';
import { LuxonDateAdapter } from '@koobiq/angular-luxon-adapter/adapter';

@NgModule({
    providers: [
        { provide: Window, useValue: window },
        { provide: KBQ_DATE_LOCALE, useValue: 'ru-RU' },
        { provide: DateAdapter, useClass: LuxonDateAdapter },
        { provide: DateFormatter, deps: [DateAdapter, KBQ_DATE_LOCALE] }
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
        }
    }
}
