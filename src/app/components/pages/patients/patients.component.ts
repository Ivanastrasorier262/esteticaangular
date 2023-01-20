import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Consultation, Patient} from 'src/app/model/patient';
import { HistoryService } from 'src/app/service/history.service';
import { PatientsService } from 'src/app/service/patient.service';
import { StorageService } from 'src/app/service/storage.service';
import { ClassesHelpers } from 'src/app/utils/classes.helpers';
import { CorporalDataComponent } from './components/corporal-data/corporal-data.component';
import { FacialDataComponent } from './components/facial-data/facial-data.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';

@Component({
    templateUrl: './patients.component.html',
    providers: [MessageService]
})
export class PatientsComponent implements OnInit {

    @ViewChild(PersonalDataComponent) private personalData!: PersonalDataComponent;

    @ViewChild(CorporalDataComponent) private corporalData!: CorporalDataComponent;

    @ViewChild(FacialDataComponent) private facialData!: FacialDataComponent;
    

    loadingDialog: boolean = false;

    patientDialog: boolean = false;

    deletePatientDialog: boolean = false;

    deletePatientsDialog: boolean = false;

    patients: Patient[] = [];
    
    patient: Patient = {};

    patientView: Patient = {};

    selectedPatients: Patient[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [10, 50, 100];
    
    constructor(private patientsService: PatientsService, private historyService: HistoryService, 
        private messageService: MessageService, private storageService: StorageService) { }

    ngOnInit() {
        this.patientsService.getPatients().subscribe(data => {
            this.patients = data.map(p=>{
                ClassesHelpers.adjustPatitentFbToObj(p);
                return p;
            });
        });
        this.cols = [
            { field: 'code', header: 'Codgio SW' },
            { field: 'name', header: 'Nombre' },
            { field: 'age', header: 'Edad' },
            { field: 'occupation', header: 'Ocupacion' },
            { field: 'lastConsultation', header: 'Ultima Consulta' }
        ];
    }

    openNew() {
        this.patient = {};
        this.submitted = false;
        this.patientDialog = true;
    }

    editPatient(patient: Patient) {
        this.patient = { ...patient };
        this.patientDialog = true;
    }

    hideDialog() {
        this.patientDialog = false;
        this.submitted = false;
    }

    deleteSelectedPatients() {
        this.deletePatientsDialog = true;
    }

    async confirmDeleteSelected() {
        this.deletePatientsDialog = false;
        this.showLoading();
        const list = this.selectedPatients.map(p=>p.id!);
        try {
            await this.patientsService.deleteList(list);
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Los pacientes se eliminaron correctamente', life: 3000 });
            this.selectedPatients = [];
        }
        catch(reason){
            console.error('confirmDeleteSelected', reason);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al eliminar a los pacientes', life: 3000 });
        }
        this.hideLoading();
    }

    deletePatient(patient: Patient) {
        this.deletePatientDialog = true;
        this.patient = { ...patient };
    }

    async confirmDelete() {
        this.deletePatientDialog = false;
        this.showLoading();
        try {
            await this.patientsService.delete(this.patient.id!);
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'El paciente se eliminó correctamente', life: 3000 });
            this.patientDialog = false;
            this.patient = {};
        }
        catch(reason){
            console.error('confirmDelete', reason);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al eliminar el paciente', life: 3000 });
        }
        this.hideLoading();
    }

    async save(type: string) {
        this.submitted = true;
        const validatePersonalData = this.personalData.validate();

        if(!validatePersonalData){
            this.messageService.add({ severity: 'warn', summary: 'Revise los campos', detail: 'Existen campos sin completar o con formato invalido', life: 3000 });
            return;
        }
        this.showLoading();
        const imagesCorporal = this.corporalData?.uploadedFilesCorporal;
        const imagesFacial = this.facialData?.uploadedFilesFacial;
        const facialDrawImage = this.facialData?.getFacialDrawImageBlob();

        let imagesToDelete: string[] = [];
        if(this.corporalData?.listImagesToDelete){
            imagesToDelete = imagesToDelete.concat(this.corporalData.listImagesToDelete);
        }
        if(this.facialData?.listImagesToDelete){
            imagesToDelete = imagesToDelete.concat(this.facialData.listImagesToDelete);
        }

        const deleteImagesResult = await this.storageService.deleteImages(imagesToDelete);
        console.log(deleteImagesResult);

        if(!deleteImagesResult){
            this.messageService.add({ severity: 'warn', summary: 'Verifique su conexión a internet o contacte con el administrador', detail: 'Ocurrió un error al subir las imagenes', life: 3000 });
            return;
        }

        const uploadResult = await this.storageService.evaluateConsultationAndUploadImages(this.patient.lastConsultation, imagesCorporal, imagesFacial, facialDrawImage);
        console.log(uploadResult);

        if(!uploadResult){
            this.messageService.add({ severity: 'warn', summary: 'Verifique su conexión a internet o contacte con el administrador', detail: 'Ocurrió un error al subir las imagenes', life: 3000 });
            return;
        }

        try {
            if (this.patient.id) {
                if(type === 'consultation'){
                    await this.historyService.save(this.patient.lastConsultation!);
                } else {
                    await this.historyService.update(this.patient.lastConsultation!);
                }
                await this.patientsService.update(this.patient);
            } else{
                if(type === 'consultation'){
                    await this.historyService.save(this.patient.lastConsultation!);
                }
                await this.patientsService.save(this.patient);
            }
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'El registro se guardo correctamente', life: 3000 });
            if(type === 'patient'){
                this.patientDialog = false;
            } else {
                this.patientConsultationDialog = false;
            }
            this.patient = {};
        }
        catch(reason){
            console.error('savePatient', reason);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el registro', life: 3000 });
        }
        this.hideLoading();
    }

    showLoading() {
        this.loadingDialog = true;
    }

    hideLoading() {
        this.loadingDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    /* #region Consultation */
    patientConsultationDialog: boolean = false;

    lastConsultationCopy?: Consultation;

    addConsultation(patient: Patient){
        this.patient = { ...patient };
        if(this.patient.lastConsultation){
            this.lastConsultationCopy = {...this.patient.lastConsultation};
        } else{
            this.lastConsultationCopy = undefined;
        }
        this.patient.lastConsultation = { idPatient: patient.id, date: new Date() };
        this.patientConsultationDialog = true;
    }

    hideConsultationDialog(){
        this.patientConsultationDialog = false;
    }

    addBodyInformation(){
        this.patient.lastConsultation!.bodyInformation = { date: new Date(), bodyMeasurements: {}, inspection: {} };
    }

    addFacialInformation(){
        this.patient.lastConsultation!.facialInformation = {date: new Date()};
    }

    preLoadFormData(type: string){
        event?.preventDefault();
        event?.stopPropagation();

        if(type === 'consultation'){
            this.loadConsultationData();
            this.loadCorporalData();
            this.loadFacialData();
        } else if(type === 'corporal'){
            this.loadCorporalData();
        } else if(type === 'facial'){
            this.loadFacialData();
        }
    }

    private loadConsultationData(){
        if(this.lastConsultationCopy){
            this.patient.lastConsultation = {...this.lastConsultationCopy };
            this.patient.lastConsultation!.date = new Date();
        }
    }

    private loadCorporalData(){
        if(this.lastConsultationCopy?.bodyInformation){
            this.patient.lastConsultation!.bodyInformation = {...this.lastConsultationCopy?.bodyInformation};
            this.patient.lastConsultation!.bodyInformation!.date = new Date();
            this.patient.lastConsultation!.bodyInformation!.images = [];
        }
    }

    private loadFacialData(){
        if(this.lastConsultationCopy?.facialInformation){
            this.patient.lastConsultation!.facialInformation = {...this.lastConsultationCopy?.facialInformation};
            this.patient.lastConsultation!.facialInformation!.date = new Date();
            this.patient.lastConsultation!.facialInformation!.images = [];
            delete this.patient.lastConsultation!.facialInformation!.facialImage;
        }
    }

    cleanFormData(type: string){
        event?.preventDefault();
        event?.stopPropagation();

        if(type === 'consultation'){
            this.patient.lastConsultation = {};
        } else if(type === 'corporal'){
            this.patient.lastConsultation!.bodyInformation = { bodyMeasurements: {}, inspection: {} };
        } else if(type === 'facial'){
            this.patient.lastConsultation!.facialInformation = {};
        }

    }

    /* #endregion */


    /* #region History */

    patientHistoryDialog: boolean  = false;

    viewHistory(patient: Patient) {
        this.patient = { ...patient };
        this.patientHistoryDialog = true;
    }
    /* #endregion */


    /* #region ConsultationView */
    patientConsultationViewDialog: boolean = false;

    onOpenConsultationView($event: Patient){
        console.log('onOpenConsultationView');
        this.patientHistoryDialog  = false;
        this.patientView = { ...$event };
        this.patientConsultationViewDialog = true;
    }

    onHidePatientConsultationViewDialog(){
        this.patientConsultationViewDialog = false;
        this.viewHistory(this.patient);
    }

}
