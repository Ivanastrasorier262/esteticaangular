import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Patient } from 'src/app/model/patient';

import moment from 'moment';

@Component({
    templateUrl: './personal-data.component.html',
    selector: 'app-personal-data',
    providers: [MessageService]
})
export class PersonalDataComponent implements OnInit {

    @Input()
    patient: Patient = {};

    @Input()
    readonly: boolean = false;
    
    @Input()
    submitted:boolean = false;

    constructor(private messageService: MessageService) { }

    ngOnInit() {
        this.calculateDate();
    }

    calculateDate(){
        if(moment(this.patient?.birthDate)){
            this.patient.age = moment().diff(this.patient?.birthDate, 'years');
        } else{
            this.patient.age = undefined;
        }
    }

    validate(): boolean{
        if(!this.patient.code || !this.patient.name || !this.patient.surname1 || !this.patient.birthDate || !moment(this.patient.birthDate).isValid()){
            console.log('verify personal-data FAIL');
            return false;
        }
        console.log('verify personal-data OK');
        return true;
    }


}
