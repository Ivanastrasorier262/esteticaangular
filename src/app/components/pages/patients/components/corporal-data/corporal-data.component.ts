import { Component, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CellulitisEnum, ContraceptiveMethodsEnum, ContraindicationsEnum, DailyActivitiesEnum, Patient, YesNoMaybeEnum } from 'src/app/model/patient';
import { EnumHelpers } from 'src/app/utils/enum.helpers';

@Component({
    templateUrl: './corporal-data.component.html',
    selector: 'app-corporal-data',
    providers: [MessageService]
})
export class CorporalDataComponent implements OnInit {

    @Input()
    patient: Patient = {};

    @Input()
    readonly: boolean = false;

    @Input()
    showImageLoader: boolean = false;

    submitted:boolean = false;

    completeListCellulitis: string[] = EnumHelpers.getNames(CellulitisEnum);

    uploadedFilesCorporal: any[] = [];

    listImagesToDelete: string[] = [];

    onUploadFilesCorporal(event: any) {
        for (const file of event.files) {
            this.uploadedFilesCorporal.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Se cargó la imagen', life: 1000 });
    }

    onRemoveFilesCorporal(event: any) {
        const idx = this.uploadedFilesCorporal.indexOf(event.file);
        this.uploadedFilesCorporal.splice(idx, 1);
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Se eliminó la imagen', life: 1000 });
    }

    constructor(private messageService: MessageService) { }

    ngOnInit() {
        this.calculateImc();
    }

    onCloseImagePreview(){
        
    }
    
    calculateImc(){
        if(this.patient?.lastConsultation?.bodyInformation?.bodyMeasurements?.weight &&
            this.patient?.lastConsultation?.bodyInformation?.bodyMeasurements?.height && 
            this.patient?.lastConsultation?.bodyInformation?.bodyMeasurements?.height > 0
            ){
                this.patient.lastConsultation.bodyInformation.bodyMeasurements.bodyMassIndex = 
                this.patient.lastConsultation.bodyInformation.bodyMeasurements.weight / 
                Math.pow(this.patient.lastConsultation.bodyInformation.bodyMeasurements.height, 2);
        } else{
            delete this.patient.lastConsultation!.bodyInformation!.bodyMeasurements!.bodyMassIndex;
        }
    }

    deleteImage(imageUrl: string){
        const idxImageUrl = this.patient.lastConsultation?.bodyInformation?.images?.indexOf(imageUrl);
        if(idxImageUrl != undefined && idxImageUrl != null && idxImageUrl != -1){
            this.listImagesToDelete.push(imageUrl);
            this.patient.lastConsultation?.bodyInformation?.images?.splice(idxImageUrl, 1);
        }
    }
}
