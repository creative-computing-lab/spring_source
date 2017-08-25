import {AbstractControl} from '@angular/forms';

export class NumbericValidator {

    static number(control: AbstractControl): ValidationResult {

        var NUMBERIC_REGEXP = /^[0-9]{4}$/;

        if ( !NUMBERIC_REGEXP.test(control.value) ) {
            return { "number": true };
        }

        return null;
    }

}

export interface ValidationResult {
    [key: string]: boolean;
}
