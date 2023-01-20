import { Timestamp } from "firebase/firestore";

export interface Patient {
    id?: string;
    code?: string;
    name?: string;
    surname1?: string;
    surname2?: string;
    birthDate?: Date | Timestamp;
    age?: number;
    occupation?: string;
    loadDate?: Date | Timestamp;
    updateDate?: Date | Timestamp;
    lastConsultation?: Consultation;
}

export interface Consultation {
    id?: string;
    idPatient?: string;
    reasonForConsultation?: string;
    attendedBy?: ProfessionalsEnum;
    date?: Date | Timestamp;
    
    pregnancies?: boolean;
    sons?: number;
    menopause?: boolean;
    menstrualdisturbances?: boolean;
    contraceptiveMethods?: ContraceptiveMethodsEnum[];
    diseases?: string[];
    allergies?: string[];
    medicines?: string[];
    constipation?: YesNoMaybeEnum;
    digestions?: string;
    heavyLegs?: boolean;
    smoke?: boolean;
    amountSmoke?: number; // per day
    drinkAlcohol?: boolean;
    drinkCoffee?: boolean;
    performPhysicalActivity?: boolean;
    performPhysicalActivityFrequency?: number; // per week
    dailyActivity?: DailyActivitiesEnum;
    hourOfSleep?: number; // per day
    sunbathe?: boolean;
    sunbatheFrequency?: string;
    loseWeightEasily?: boolean;
    takeCareOfTheSkinDaily?: YesNoMaybeEnum;

    dietAndWaterIntake?: string;

    previousTreatments?: string;
    contraindications?: (ContraindicationsEnum|string) [];

    bodyInformation?: BodyInformation;
    facialInformation?: FacialInformation;

    observations?: string;

}

export enum ContraceptiveMethodsEnum {
    "DIAS" = "DIAS", 
    "PILDORA" = "PILDORA", 
    "DIU" = "DIU", 
    "PRESERVATIVO" = "PRESERVATIVO", 
    "PARCHE" = "PARCHE", 
    "NINGUNO" = "NINGUNO", 
    "OTROS" = "OTROS"
}

export enum DailyActivitiesEnum {
    "SEDENTARIA" = "SEDENTARIA", 
    "ACTIVA" = "ACTIVA", 
    "MUY ACTIVA" = "MUY ACTIVA"
}

export enum YesNoMaybeEnum {
    "SI" = "SI", 
    "NO" = "NO", 
    "A VECES" = "A VECES"
}

export enum ContraindicationsEnum {
    "DIABETES" = "DIABETES",
    "EPILEPSIA" = "EPILEPSIA",
    "TROMBOSIS/FLEBITIS" = "TROMBOSIS/FLEBITIS",
    "EDEMA" = "EDEMA",
    "ALTERACIONES DE LA PIEL" = "ALTERACIONES DE LA PIEL",
    "ASMA" = "ASMA",
    "PRESIÓN ARTERIAL" = "PRESIÓN ARTERIAL",
    "PROBLEMAS CARDIACOS" = "PROBLEMAS CARDIACOS",
    "OTRAS" = "OTRAS"
}

export interface BodyInformation {
    id?: string;
    date?: Date | Timestamp;
    inspection?: BodyInspection,
    bodyMeasurements?: BodyMeasurements
    bodyimage?: string;
    images?: string[];
    observations?: string;
}

export interface BodyMeasurements {
    weight?: number;
    height?: number;
    bodyMassIndex?: number;

    rightArm?: number;
    rightArmM?: number;
    leftArm?: number;
    leftArmM?: number;
    chest?: number;
    chestM?: number;
    waistO?: number;
    waistOM?: number;
    waistS?: number;
    waistSM?: number;
    waistI?: number;
    waistIM?: number;
    huckle?: number;
    huckleM?: number;
    rightThigh?: number;
    rightThighM?: number;
    leftThigh?: number;
    leftThighM?: number;
    rightKnee?: number;
    rightKneeM?: number;
    leftKnee?: number;
    leftKneeM?: number;
    rightAnkle?: number;
    rightAnkleM?: number;
    leftAnkle?: number;
    leftAnkleM?: number;
}

export interface BodyInspection {
    cellulitis?: CellulitisEnum;
    retentionEdema?: boolean;
    retentionEdemaZones?: string[];
}

export enum CellulitisEnum {
    "EDEMATOSA" = "EDEMATOSA", 
    "FIBROSA" = "FIBROSA", 
    "BLANDA/FLÁSIDA" = "BLANDA/FLÁSIDA", 
    "MIXTA" = "MIXTA"
}

export interface FacialInformation {
    id?: string;
    date?: Date | Timestamp;
    facialImage?: string;
    images?: string[];
    color?: ColorsEnum;
    texture?: TexturesEnum;
    hydration?: HydratationsEnum;
    pore?: PoresEnum;
    acne?: AcnesEnum;
    pigment?: PigmentsEnum;
    vascular?: VascularsEnum;
    scar?: ScarsEnum;
    skin?: SkinsEnum;
    muscularTone?: MuscularTonesEnum;
    observations?: string;
}

export enum ColorsEnum {
    "NORMAL" = "NORMAL", 
    "CETRINA" = "CETRINA", 
    "OPACA" = "OPACA", 
    "ROJIZA" = "ROJIZA"
}

export enum TexturesEnum {
    "NORMAL" = "NORMAL", 
    "FINA" = "FINA", 
    "GRUESA" = "GRUESA", 
    "ASPERA" = "ASPERA", 
    "SUAVE" = "SUAVE"
}

export enum HydratationsEnum {
    "DESHIDRATADA" = "DESHIDRATADA", 
    "NORMAL" = "NORMAL", 
    "MUY HIDRATADA" = "MUY HIDRATADA", 
    "HIPER HIDRATADA" = "HIPER HIDRATADA"
}

export enum PoresEnum {
    "NORMAL" = "NORMAL", 
    "DILATADO" = "DILATADO", 
    "OCLUIDO" = "OCLUIDO"
}

export enum AcnesEnum {
    "LESIONES COMEDONES" = "LESIONES COMEDONES", 
    "PÚSTULAS" = "PÚSTULAS", 
    "PÁPULAS" = "PÁPULAS"
}

export enum PigmentsEnum {
    "EFÉLIDES" = "EFÉLIDES", 
    "HIPERCROMIAS"= "HIPERCROMIAS", 
    "NEVUS" = "NEVUS", 
    "MELASMA" = "MELASMA", 
    "LÉNTIGOS" = "LÉNTIGOS", 
    "ACROMÍAS" = "ACROMÍAS"
}

export enum VascularsEnum {
    "ERITEMA" = "ERITEMA", 
    "TELANGIECTASIAS" = "TELANGIECTASIAS"
}

export enum ScarsEnum {
    "ATRÓFICAS" = "ATRÓFICAS", 
    "HIPERTRÓFICAS" = "HIPERTRÓFICAS", 
    "QUELOIDE" = "QUELOIDE"
}

export enum SkinsEnum {
    "NORMAL" = "NORMAL", 
    "SECA" = "SECA", 
    "SENSIBLE" = "SENSIBLE", 
    "MIXTA" = "MIXTA", 
    "GRASA" = "GRASA"
}

export enum MuscularTonesEnum {
    "BUENO" = "BUENO", 
    "MEDIO" = "MEDIO", 
    "POBRE" = "POBRE"
}

export enum ProfessionalsEnum {
    "Erika Soledad Zaya" = "Erika Soledad Zaya", 
    "Raquel Poderoso Reinoso" = "Raquel Poderoso Reinoso"
}