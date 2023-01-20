import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { Consultation, Patient } from "../model/patient";

export class ClassesHelpers {

    static adjustPatitentFbToObj(patient: Patient){
        if(patient.birthDate){
            patient.birthDate = (patient.birthDate as Timestamp).toDate();
            patient.age = moment().diff(patient.birthDate, 'years');
        }
        if(patient.loadDate){
            patient.loadDate = (patient.loadDate as Timestamp).toDate();
        }
        if(patient.updateDate){
            patient.updateDate = (patient.updateDate as Timestamp).toDate();
        }
        ClassesHelpers.adjustConsultationFbToObj(patient.lastConsultation);
    }

    static adjustConsultationFbToObj(consultation?: Consultation){
        if(consultation){
            consultation.date = (consultation.date as Timestamp).toDate();
            if(consultation.bodyInformation){
                consultation.bodyInformation.date = (consultation.bodyInformation.date as Timestamp).toDate();
            }
            if(consultation.facialInformation){
                consultation.facialInformation.date = (consultation.facialInformation.date as Timestamp).toDate();
            }
        }
    }
}