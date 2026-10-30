import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { TranslocoLoaderData } from '@ngneat/transloco/lib/transloco.loader';
import { map, Observable, of, zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AvailableScopes } from './available-scopes';


export const TRANSLATION_CACHE_KEY = new InjectionToken<string>('TRANSLATION_CACHE_KEY');

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {

    constructor(
        private httpClient: HttpClient,
        @Inject(TRANSLATION_CACHE_KEY) private cacheKey: string
    ) {
    }

    getTranslation(
        locale: string,
        data?: TranslocoLoaderData
    ): Observable<Translation> {
        const scopes = Object.values(AvailableScopes);

        const requests = scopes.map((scope) => {
            const path = `/assets/i18n/${ locale }/${ scope }.json`;

            return this.httpClient.get(path).pipe(
                catchError(() => {
                    console.error('Could not find translation file:', path);
                    return of({});
                })
            );
        });


        return zip(requests).pipe(
            map((response) => {
                let allTranslations = {};

                response.forEach((translations) => {
                    allTranslations = {
                        ...allTranslations,
                        ...translations
                    };
                });

                return allTranslations;
            })
        );
    }
}
