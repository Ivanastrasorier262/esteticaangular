import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../model/patient';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class PatientsService {

    private collectionName = (environment.production ? '' : 'dev-') + 'patients';
    private itemsCollection: AngularFirestoreCollection<Patient>;
    private items: Observable<Patient[]>;

    constructor(private http: HttpClient, private afs: AngularFirestore) { 
        this.itemsCollection = afs.collection<Patient>(this.collectionName);
        this.items = this.itemsCollection.valueChanges();
    }

    getPatients(): Observable<Patient[]> {
        return this.items;
    }

    async save(patient: Patient) {
        const id = this.afs.createId();
        patient.id = id;
        patient.loadDate = new Date();
        return this.itemsCollection.doc(id).set(patient);
    }

    async update(patient: Patient) {
        patient.updateDate = new Date();
        return this.itemsCollection.doc(patient.id).update(patient);
    }

    async delete(id: string) {
        return this.itemsCollection.doc(id).delete();
    }

    async deleteList(ids: string[]) {
        const batch = this.afs.firestore.batch();
        ids.forEach((id)=> {
            batch.delete(this.itemsCollection.doc(id).ref);
        });
        return batch.commit();
    }
}
