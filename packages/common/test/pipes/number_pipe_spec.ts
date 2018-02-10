/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import localeEn from '@angular/common/locales/en';
import localeEsUS from '@angular/common/locales/es-US';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';
import {registerLocaleData, CurrencyPipe, DecimalPipe, PercentPipe} from '@angular/common';
import {beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';

{
  describe('Number pipes', () => {
    beforeAll(() => {
      registerLocaleData(localeEn);
      registerLocaleData(localeEsUS);
      registerLocaleData(localeFr);
      registerLocaleData(localeAr);
    });

    function isNumeric(value: any): boolean { return !isNaN(value - parseFloat(value)); }

    describe('DecimalPipe', () => {
      describe('transform', () => {
        let pipe: DecimalPipe;
        beforeEach(() => { pipe = new DecimalPipe('en-US'); });

        it('should return correct value for numbers', () => {
          expect(pipe.transform(12345)).toEqual('12,345');
          expect(pipe.transform(123, '.2')).toEqual('123.00');
          expect(pipe.transform(1, '3.')).toEqual('001');
          expect(pipe.transform(1.1, '3.4-5')).toEqual('001.1000');
          expect(pipe.transform(1.123456, '3.4-5')).toEqual('001.12346');
          expect(pipe.transform(1.1234)).toEqual('1.123');
          expect(pipe.transform(1.123456, '.2')).toEqual('1.123');
          expect(pipe.transform(1.123456, '.4')).toEqual('1.1235');
        });

        it('should support strings', () => {
          expect(pipe.transform('12345')).toEqual('12,345');
          expect(pipe.transform('123', '.2')).toEqual('123.00');
          expect(pipe.transform('1', '3.')).toEqual('001');
          expect(pipe.transform('1.1', '3.4-5')).toEqual('001.1000');
          expect(pipe.transform('1.123456', '3.4-5')).toEqual('001.12346');
          expect(pipe.transform('1.1234')).toEqual('1.123');
        });

        it('should not support other objects', () => {
          expect(() => pipe.transform({}))
              .toThrowError(
                  `InvalidPipeArgument: '[object Object] is not a number' for pipe 'DecimalPipe'`);
          expect(() => pipe.transform('123abc'))
              .toThrowError(`InvalidPipeArgument: '123abc is not a number' for pipe 'DecimalPipe'`);
        });

        it('should throw if minFractionDigits is explicitly higher than maxFractionDigits', () => {
          expect(() => pipe.transform('1.1', '3.4-2')).toThrowError(/is higher than the maximum/);
        });
      });

      describe('transform with custom locales', () => {
        it('should return the correct format for es-US', () => {
          const pipe = new DecimalPipe('es-US');
          expect(pipe.transform('9999999.99', '1.2-2')).toEqual('9,999,999.99');
        });
      });
    });

    describe('PercentPipe', () => {
      let pipe: PercentPipe;

      beforeEach(() => { pipe = new PercentPipe('en-US'); });

      describe('transform', () => {
        it('should return correct value for numbers', () => {
          expect(pipe.transform(1.23)).toEqual('123%');
          expect(pipe.transform(1.2, '.2')).toEqual('120.00%');
          expect(pipe.transform(1.2, '4.2')).toEqual('0,120.00%');
          expect(pipe.transform(1.2, '4.2', 'fr')).toEqual('0 120,00 %');
          expect(pipe.transform(1.2, '4.2', 'ar')).toEqual('0,120.00‎%‎');
          // see issue #20136
          expect(pipe.transform(0.12345674, '0.0-10')).toEqual('12.345674%');
          expect(pipe.transform(0, '0.0-10')).toEqual('0%');
          expect(pipe.transform(0.00, '0.0-10')).toEqual('0%');
          expect(pipe.transform(1, '0.0-10')).toEqual('100%');
          expect(pipe.transform(0.1, '0.0-10')).toEqual('10%');
          expect(pipe.transform(0.12, '0.0-10')).toEqual('12%');
          expect(pipe.transform(0.123, '0.0-10')).toEqual('12.3%');
          expect(pipe.transform(12.3456, '0.0-10')).toEqual('1,234.56%');
          expect(pipe.transform(12.345600, '0.0-10')).toEqual('1,234.56%');
          expect(pipe.transform(12.345699999, '0.0-6')).toEqual('1,234.57%');
          expect(pipe.transform(12.345699999, '0.4-6')).toEqual('1,234.5700%');
          expect(pipe.transform(100, '0.4-6')).toEqual('10,000.0000%');
          expect(pipe.transform(100, '0.0-10')).toEqual('10,000%');
          expect(pipe.transform(1.5e2)).toEqual('15,000%');
          expect(pipe.transform(1e100)).toEqual('1E+102%');
        });

        it('should not support other objects', () => {
          expect(() => pipe.transform({}))
              .toThrowError(
                  `InvalidPipeArgument: '[object Object] is not a number' for pipe 'PercentPipe'`);
        });
      });
    });

    describe('CurrencyPipe', () => {
      let pipe: CurrencyPipe;

      beforeEach(() => { pipe = new CurrencyPipe('en-US'); });

      describe('transform', () => {
        it('should return correct value for numbers', () => {
          expect(pipe.transform(123)).toEqual('$123.00');
          expect(pipe.transform(12, 'EUR', 'code', '.1')).toEqual('EUR12.0');
          expect(pipe.transform(5.1234, 'USD', 'code', '.0-3')).toEqual('USD5.123');
          expect(pipe.transform(5.1234, 'USD', 'code')).toEqual('USD5.12');
          expect(pipe.transform(5.1234, 'USD', 'symbol')).toEqual('$5.12');
          expect(pipe.transform(5.1234, 'CAD', 'symbol')).toEqual('CA$5.12');
          expect(pipe.transform(5.1234, 'CAD', 'symbol-narrow')).toEqual('$5.12');
          expect(pipe.transform(5.1234, 'CAD', 'symbol-narrow', '5.2-2')).toEqual('$00,005.12');
          expect(pipe.transform(5.1234, 'CAD', 'symbol-narrow', '5.2-2', 'fr'))
              .toEqual('00 005,12 $');
          expect(pipe.transform(5, 'USD', 'symbol', '', 'fr')).toEqual('5,00 $US');
        });

        it('should support any currency code name', () => {
          // currency code is unknown, default formatting options will be used
          expect(pipe.transform(5.1234, 'unexisting_ISO_code', 'symbol'))
              .toEqual('unexisting_ISO_code5.12');
          // currency code is USD, the pipe will format based on USD but will display "Custom name"
          expect(pipe.transform(5.1234, 'USD', 'Custom name')).toEqual('Custom name5.12');
        });

        it('should round to the default number of digits if no digitsInfo', () => {
          // IDR has a default number of digits of 0
          expect(pipe.transform(5.1234, 'IDR')).toEqual('IDR5');
          expect(pipe.transform(5.1234, 'IDR', 'symbol', '.2')).toEqual('IDR5.12');
          expect(pipe.transform(5.1234, 'IDR', 'Custom name')).toEqual('Custom name5');
          // BHD has a default number of digits of 3
          expect(pipe.transform(5.1234, 'BHD')).toEqual('BHD5.123');
          expect(pipe.transform(5.1234, 'BHD', 'symbol', '.1-2')).toEqual('BHD5.12');
        });

        it('should not support other objects', () => {
          expect(() => pipe.transform({}))
              .toThrowError(
                  `InvalidPipeArgument: '[object Object] is not a number' for pipe 'CurrencyPipe'`);
        });

        it('should warn if you are using the v4 signature', () => {
          const warnSpy = spyOn(console, 'warn');
          pipe.transform(123, 'USD', true);
          expect(warnSpy).toHaveBeenCalledWith(
              `Warning: the currency pipe has been changed in Angular v5. The symbolDisplay option (third parameter) is now a string instead of a boolean. The accepted values are "code", "symbol" or "symbol-narrow".`);
        });
      });
    });

    describe('isNumeric', () => {
      it('should return true when passing correct numeric string',
         () => { expect(isNumeric('2')).toBe(true); });

      it('should return true when passing correct double string',
         () => { expect(isNumeric('1.123')).toBe(true); });

      it('should return true when passing correct negative string',
         () => { expect(isNumeric('-2')).toBe(true); });

      it('should return true when passing correct scientific notation string',
         () => { expect(isNumeric('1e5')).toBe(true); });

      it('should return false when passing incorrect numeric',
         () => { expect(isNumeric('a')).toBe(false); });

      it('should return false when passing parseable but non numeric',
         () => { expect(isNumeric('2a')).toBe(false); });
    });
  });
}
