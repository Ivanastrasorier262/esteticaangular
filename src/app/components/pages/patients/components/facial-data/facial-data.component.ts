import { Component, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AcnesEnum, CellulitisEnum, ColorsEnum, ContraceptiveMethodsEnum, ContraindicationsEnum, DailyActivitiesEnum, HydratationsEnum, MuscularTonesEnum, Patient, PigmentsEnum, PoresEnum, ScarsEnum, SkinsEnum, TexturesEnum, VascularsEnum, YesNoMaybeEnum } from 'src/app/model/patient';
import { EnumHelpers } from 'src/app/utils/enum.helpers';

@Component({
    templateUrl: './facial-data.component.html',
    selector: 'app-facial-data',
    providers: [MessageService]
})
export class FacialDataComponent implements OnInit {

    @Input()
    patient: Patient = {};

    @Input()
    readonly: boolean = false;
    
    @Input()
    showImageLoader: boolean = false;

    submitted:boolean = false;

    completeListColors: string[] = EnumHelpers.getNames(ColorsEnum);

    completeListTextures: string[] = EnumHelpers.getNames(TexturesEnum);

    completeListHydrations: string[] = EnumHelpers.getNames(HydratationsEnum);

    completeListPores: string[] = EnumHelpers.getNames(PoresEnum);

    completeListAcnes: string[] = EnumHelpers.getNames(AcnesEnum);

    completeListPigments: string[] = EnumHelpers.getNames(PigmentsEnum);

    completeListVasculars: string[] = EnumHelpers.getNames(VascularsEnum);

    completeListScars: string[] = EnumHelpers.getNames(ScarsEnum);

    completeListSkins: string[] = EnumHelpers.getNames(SkinsEnum);

    completeListMuscularTones: string[] = EnumHelpers.getNames(MuscularTonesEnum);

    uploadedFilesFacial: any[] = [];

    listImagesToDelete: string[] = [];

    onUploadFilesFacial(event: any) {
        for (const file of event.files) {
            this.uploadedFilesFacial.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    onRemoveFilesCorporal(event: any) {
        const idx = this.uploadedFilesFacial.indexOf(event.file);
        this.uploadedFilesFacial.splice(idx, 1);
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Se eliminó la imagen', life: 1000 });
    }

    facialDrawImage?: string;

    getFacialDrawImageBlob(){
        if(this.facialDrawImage){
            var blobBin = atob(this.facialDrawImage.split(',')[1]);
            var array = [];
            for(var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            var file = new Blob([new Uint8Array(array)], {type: 'image/png'});
            return file;
        }
        return undefined;
        
    }

    
    constructor(private messageService: MessageService) { }

    ngOnInit() {}


    onCloseImagePreview(){

    }

    deleteImage(imageUrl: string){
        const idxImageUrl = this.patient.lastConsultation?.facialInformation?.images?.indexOf(imageUrl);
        if(idxImageUrl != undefined && idxImageUrl != null && idxImageUrl != -1){
            this.listImagesToDelete.push(imageUrl);
            this.patient.lastConsultation?.facialInformation?.images?.splice(idxImageUrl, 1);
        }
    }
}
