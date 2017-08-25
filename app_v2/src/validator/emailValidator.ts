import {AbstractControl} from '@angular/forms';

export class EmailValidator{

    static email(control: AbstractControl): ValidationResult {

        var EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "email": true };
        }

        return null;
    }

}

export interface ValidationResult {
    [key: string]: boolean;
}
