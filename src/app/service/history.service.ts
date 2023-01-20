import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consultation } from '../model/patient';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HistoryService {
    private collectionName = (environment.production ? '' : 'dev-') + 'history';
    private itemsCollection: AngularFirestoreCollection<Consultation>;

    constructor(private http: HttpClient, private afs: AngularFirestore) { 
        this.itemsCollection = afs.collection<Consultation>(this.collectionName);
    }

    getHistory(idPatient:string): Observable<Consultation[]> {
        return this.afs.collection<Consultation>(this.collectionName,p=>p.where('idPatient', '==', idPatient).orderBy('date', 'desc')).valueChanges()
    }

    async save(consultation: Consultation) {
        const id = this.afs.createId();
        consultation.id = id;
        return this.itemsCollection.doc(id).set(consultation);
    }

    async update(consultation: Consultation) {
        return this.itemsCollection.doc(consultation.id).update(consultation);
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
