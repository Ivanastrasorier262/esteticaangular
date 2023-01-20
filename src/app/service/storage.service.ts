import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Consultation } from '../model/patient';
import { ImageCompressHelpers } from '../utils/image.compress.helpers';

@Injectable()
export class StorageService {

    constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { 
    }

    async evaluateConsultationAndUploadImages(consultation?: Consultation, corporalImageFiles?: File[], facialImageFiles?: File[], facialDrawImage?: Blob) {
        const self = this;

        let tasksImagesCorporal: Promise<string>[] = [];
        let tasksImagesFacial: Promise<string>[] = [];
        let taskImageFacialDraw: Promise<string>|null = null;
        if(consultation?.bodyInformation && corporalImageFiles && corporalImageFiles.length > 0){
            corporalImageFiles.forEach(image =>{
                console.log('corporalImageFiles ', image);
                tasksImagesCorporal.push(self.uploadFile(image));
            })
        }

        if(consultation?.facialInformation && facialImageFiles && facialImageFiles.length > 0){
            facialImageFiles.forEach(image =>{
                console.log('facialImageFiles ', image);
                tasksImagesFacial.push(self.uploadFile(image));
            })
        }

        if(facialDrawImage){
            console.log('facialDrawImage ', facialDrawImage);
            taskImageFacialDraw = self.uploadFile(facialDrawImage);
        }

        tasksImagesCorporal.length > 0 && await Promise.all(tasksImagesCorporal).then(p=>{
            if(!consultation!.bodyInformation?.images){
                consultation!.bodyInformation!.images = [];
            }
            p.forEach(urlImage =>{
                consultation!.bodyInformation?.images?.push(urlImage);
            });
        });

        tasksImagesFacial.length > 0 && await Promise.all(tasksImagesFacial).then(p=>{
            if(!consultation!.facialInformation?.images){
                consultation!.facialInformation!.images = [];
            }
            p.forEach(urlImage =>{
                consultation!.facialInformation?.images?.push(urlImage);
            });
        });

        taskImageFacialDraw && await taskImageFacialDraw.then(urlImage=>{
            consultation!.facialInformation!.facialImage = urlImage;
        });

        return true;
    }


    async deleteImages(imagesToDelete?: string[]) {
        const self = this;
        let tasksDeleteImages: Promise<any>[] = [];

        if(imagesToDelete && imagesToDelete.length > 0){
            imagesToDelete.forEach(image =>{
                console.log('deleteImages ', image);
                const decodeUrl = decodeURI(image);
                console.log('deleteImages Decoded ', decodeUrl);
                const pathImage = decodeUrl.replace('https://firebasestorage.googleapis.com/v0/b/eterea-fisiaestetica.appspot.com/o/', '').split('?')[0];
                console.log('deleteImages pathImage ', pathImage);
                tasksDeleteImages.push(self.deleteFile(pathImage));
            })
        }
        tasksDeleteImages.length > 0 && await Promise.all(tasksDeleteImages);
        return true;
    }

    /*private uploadFile(file: Blob|File) {
        return new Promise<string>((resolve, reject) =>{
            const idFileName = this.afs.createId();
            const filePath = `${idFileName}-${file instanceof File ? file.name : 'drawimage' }`;
            const ref = this.storage.ref(filePath);
            console.log(`uploadFile: ${filePath}`);
            return ref.put(file).then(()=>{
                return ref.getDownloadURL().subscribe(resolve)
            }).catch(reject);
        });
    }*/

    private uploadFile(file: File|Blob) {
        return new Promise<string>(async (resolve, reject) => {
            const idFileName = this.afs.createId();
            const filePath = `${idFileName}`;
            const ref = this.storage.ref(filePath);
            console.log(`uploadFile: ${filePath}`);

            let blob;
            if(file instanceof File){
                blob = await ImageCompressHelpers.compressImage(file);
                if(!blob){
                    reject("compress image fail");
                    return;
                }
            } else{
                blob = file;
            }
            return ref.put(blob).then(()=>{
                return ref.getDownloadURL().subscribe(resolve)
            }).catch(reject);
        });
    }

    private deleteFile(filePath: string) {
        const ref = this.storage.ref(filePath);
        console.log(`deleteFile: ${filePath}`);
        return ref.delete().toPromise();
    }

}
