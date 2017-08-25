import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[equalTo][formControlName],[equalTo][formControl],[equalTo][ngModel]',
    providers: [
        {provide : NG_VALIDATORS , useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator implements Validator {
    constructor( @Attribute('equalTo') public equalTo: string,
        @Attribute('reverse') public reverse: string) {

    }

    public get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        let v = c.value;

        // control vlaue
        let e = c.root.get(this.equalTo);

        // value not equal
        if (e && v !== e.value && !this.isReverse) {
          return {
            equalTo: false
          }
        }

        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['equalTo'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }

        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({
                equalTo: false
            })
        }

        return null;
    }
}
