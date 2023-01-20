import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, PrimeIcons } from 'primeng/api';
import { Consultation, ContraindicationsEnum, Patient } from 'src/app/model/patient';
import { HistoryService } from 'src/app/service/history.service';
import { PatientsService } from 'src/app/service/patient.service';
import { PhotoService } from 'src/app/service/photo.service';
import { ClassesHelpers } from 'src/app/utils/classes.helpers';
import { EnumHelpers } from 'src/app/utils/enum.helpers';

@Component({
    templateUrl: './history.component.html',
    selector: 'app-history',
    providers: [MessageService]
})
export class HistoryComponent implements OnInit {

    @Input()
    patient: Patient = {};

    @Input()
    readonly: boolean = false;

    @Output()
    onOpenConsultationView = new EventEmitter<Patient>();

    loadingDialog: boolean = false;

    images!: any[];

    consultations: Consultation[] = [];

    completeListContraindications: string[] = EnumHelpers.getNames(ContraindicationsEnum);


    constructor(private patientsService: PatientsService, private historyService: HistoryService, 
        private messageService: MessageService, private photoService: PhotoService) { }

    ngOnInit() {
        this.historyService.getHistory(this.patient.id!).subscribe((data: Consultation[]) => {
            this.consultations = data.map(p=>{
                ClassesHelpers.adjustConsultationFbToObj(p);
                return p;
            });
        });

        this.photoService.getImages().then((images: any[]) => {
            this.images = images;
        });

    }

    openConsultation(idConsultation: string){
        const patient = {...this.patient};
        patient.lastConsultation = this.consultations.find(p=>p.id === idConsultation);
        this.onOpenConsultationView.emit(patient);
    }

    onCloseImagePreview() {
        event?.preventDefault();
        event?.stopPropagation();
    }

}
