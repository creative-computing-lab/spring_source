import {AbstractControl} from '@angular/forms';

export class IDValidator{

    static id(control: AbstractControl): ValidationResult {

        var ID_REGEXP = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]{0,30}$/;

        if (control.value != "" && (control.value.length <= 3 || !ID_REGEXP.test(control.value))) {
            return { "id": true };
        }

        return null;
    }

}

export interface ValidationResult {
    [key: string]: boolean;
}
