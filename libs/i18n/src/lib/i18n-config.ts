import { AvailableScopes } from './available-scopes';

export enum Locale {
    RuRu = 'ru-RU',
    EnUs = 'en-US'
}

export const AVAILABLE_LOCALES = [Locale.RuRu, Locale.EnUs];
export const DEFAULT_LOCALE = Locale.RuRu;
export const FALLBACK_LOCALE = Locale.RuRu;

export const defaultTranslocoConfig = {
    availableLangs: AVAILABLE_LOCALES,
    defaultLang: DEFAULT_LOCALE,
    fallbackLang: FALLBACK_LOCALE,
    prodMode: true,
    reRenderOnLangChange: true,
    scopeMapping: AvailableScopes
};
