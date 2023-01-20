import { Component, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CellulitisEnum, ContraceptiveMethodsEnum, ContraindicationsEnum, DailyActivitiesEnum, Patient, ProfessionalsEnum, YesNoMaybeEnum } from 'src/app/model/patient';
import { EnumHelpers } from 'src/app/utils/enum.helpers';

@Component({
    templateUrl: './consultation-data.component.html',
    selector: 'app-consultation-data',
    providers: [MessageService]
})
export class ConsultationDataComponent implements OnInit {

    @Input()
    patient: Patient = {};

    @Input()
    readonly: boolean = false;


    submitted:boolean = false;

    completeListDailyAttendedBy: string[] = EnumHelpers.getNames(ProfessionalsEnum);

    completeListContraceptiveMethods: string[] = EnumHelpers.getNames(ContraceptiveMethodsEnum);

    completeListConstipation: string[] = EnumHelpers.getNames(YesNoMaybeEnum);

    completeListDailyActivity: string[] = EnumHelpers.getNames(DailyActivitiesEnum);

    completeListTakeCareOfTheSkinDaily: string[] =  EnumHelpers.getNames(YesNoMaybeEnum);

    completeListContraindications: string[] = EnumHelpers.getNames(ContraindicationsEnum);

    constructor(private messageService: MessageService) { }

    ngOnInit() {
        
    }
}
