import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
    templateUrl: './draw-image.component.html',
    selector: 'app-draw-image',
    providers: [MessageService]
})
export class DrawImageComponent implements OnInit {
    

    @Input() backgroundImageUrl: string = 'assets/eterea/images/facial/imagen1.png';
    @Input() backgroundImageWidth: number = 400;
    @Input() backgroundImageHeight: number = 400;

    @Input() facialDrawImage?: string;
    @Output() facialDrawImageChange: EventEmitter<string> = new EventEmitter();

    @Input()
    readonly: boolean = false;


    @ViewChild('backImage', { static: true }) private backImage!: ElementRef<HTMLImageElement>;
    @ViewChild('finalImage', { static: true }) private finalImage!: ElementRef<HTMLImageElement>;
    @ViewChild('drawCanvas', { static: true }) private drawCanvas!: ElementRef<HTMLCanvasElement>;

    private canvasFacial: any;
    private ctxFacial: any;
    private flagFacial = false;    

    constructor(private messageService: MessageService) { }

    ngOnInit() {
        this.canvasFacial = this.drawCanvas.nativeElement;
        this.ctxFacial = this.canvasFacial.getContext("2d");
    }

    itemsFacialContextMenu: MenuItem[] = this.createFacialContextMenu('new');
   
    private prevXFacial = 0;
    private currXFacial = 0;
    private prevYFacial = 0;
    private currYFacial = 0;
    private dot_flagFacial = false;
    private xFacial = "black";
    private yFacial = 2;
    private wFacial = 0;
    private hFacial = 0;

    private initFacialDraw() {
        const self = this;
        this.wFacial = this.canvasFacial.width;
        this.hFacial = this.canvasFacial.height;

        const img = this.backImage.nativeElement;
        this.ctxFacial.drawImage(img, 0, 0);

        this.canvasFacial.addEventListener("mousemove", function (e:any) {
            self.findxyDrawFacial('move', e)
        }, false);
        this.canvasFacial.addEventListener("mousedown", function (e:any) {
            self.findxyDrawFacial('down', e)
        }, false);
        this.canvasFacial.addEventListener("mouseup", function (e:any) {
            self.findxyDrawFacial('up', e)
        }, false);
        this.canvasFacial.addEventListener("mouseout", function (e:any) {
            self.findxyDrawFacial('out', e)
        }, false);

        this.drawCanvas.nativeElement.style.display = "inline";
        this.finalImage.nativeElement.style.display = "none";
        this.itemsFacialContextMenu = this.createFacialContextMenu('draw');
    }

    private eraseFacialDraw() {
        this.ctxFacial.clearRect(0, 0, this.wFacial, this.hFacial);
        const img = this.backImage.nativeElement;
        this.ctxFacial.drawImage(img, 0, 0);
        this.drawCanvas.nativeElement.style.display = "none";
        this.finalImage.nativeElement.style.display = "none";
        this.itemsFacialContextMenu = this.createFacialContextMenu('new');
    }

    private deleteFinalImage() {
        this.finalImage.nativeElement.style.display = "none";
        this.itemsFacialContextMenu = this.createFacialContextMenu('new');
        this.facialDrawImageChange.emit(undefined);
    }

    private saveFacialDraw() {
        this.finalImage.nativeElement.style.border = "2px solid";
        const dataURL = this.canvasFacial.toDataURL();
        this.finalImage.nativeElement.src = dataURL;
        this.finalImage.nativeElement.style.display = "inline";

        this.drawCanvas.nativeElement.style.display = "none";
        this.itemsFacialContextMenu = this.createFacialContextMenu('new-delete');
        this.facialDrawImageChange.emit(this.canvasFacial.toDataURL('image/jpeg', 1));
    }

    private selectFacialDrawType(color: string){
        this.xFacial = color;
        if (this.xFacial == "white") this.yFacial = 14;
        else this.yFacial = 2;
    }

    private findxyDrawFacial(res:any, e:any) {
        if (res == 'down') {
            this.prevXFacial = this.currXFacial;
            this.prevYFacial = this.currYFacial;
            const curPos = this.getMousePos(e);
            this.currXFacial = curPos.x;
            this.currYFacial = curPos.y;
            this.flagFacial = true;
            this.dot_flagFacial = true;
            if (this.dot_flagFacial) {
                this.ctxFacial.beginPath();
                this.ctxFacial.fillStyle = this.xFacial;
                this.ctxFacial.fillRect(this.currXFacial, this.currYFacial, 2, 2);
                this.ctxFacial.closePath();
                this.dot_flagFacial = false;
            }
        }
        if (res == 'up' || res == "out") {
            this.flagFacial = false;
        }
        if (res == 'move') {
            if (this.flagFacial) {
                this.prevXFacial = this.currXFacial;
                this.prevYFacial = this.currYFacial;
                const curPos = this.getMousePos(e);
                this.currXFacial = curPos.x;
                this.currYFacial = curPos.y;
                this.drawFacial();
            }
        }
    }

    private drawFacial() {
        this.ctxFacial.beginPath();
        this.ctxFacial.moveTo(this.prevXFacial, this.prevYFacial);
        this.ctxFacial.lineTo(this.currXFacial, this.currYFacial);
        this.ctxFacial.strokeStyle = this.xFacial;
        this.ctxFacial.lineWidth = this.yFacial;
        this.ctxFacial.stroke();
        this.ctxFacial.closePath();
    }

    private getMousePos(evt: any) {
        const rect = this.canvasFacial.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    private createFacialContextMenu(type: string) : MenuItem[]  {
        if(type === 'new'){
            if(this.canvasFacial){
                this.canvasFacial.style.cursor = 'default';
            }            
            return [
                {
                    label:'Nuevo',
                    icon:'pi pi-fw pi-plus',
                    command: () => { 
                        this.initFacialDraw();
                    }
                }
            ]
        }if(type === 'new-delete'){
            if(this.canvasFacial){
                this.canvasFacial.style.cursor = 'default';
            }            
            return [
                {
                    label:'Nuevo',
                    icon:'pi pi-fw pi-plus',
                    command: () => { 
                        this.initFacialDraw();
                    }
                },
                {
                    label:'Eiminar',
                    icon:'pi pi-fw pi-trash',
                    command: () => { 
                        this.deleteFinalImage();
                    }
                }
            ]
        } else if(type === 'draw'){
            this.canvasFacial.style.cursor = 'crosshair';
            return [
                {
                    label:'Lapices',
                    icon:'pi pi-fw pi-pencil',
                    items:[
                        {
                            label:'Normal',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('black');
                            }
                        },
                        {
                            label:'Inflamación',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('red');
                            }
                        },
                        {
                            label:'Acne/Porfirina',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('orange');
                            }
                        },
                        {
                            label:'Poro Obstruido',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('blue');
                            }
                        },
                        {
                            label:'Deshidratación',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('green');
                            }
                        },
                        {
                            label:'Melasma',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('brown');
                            }
                        },
                        {
                            label:'Cicatriz',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('pink');
                            }
                        },
                        {
                            label:'Rosacea',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('purple');
                            }
                        },
                        {
                            label:'Sensible',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('bluelight');
                            }
                        },
                        {
                            label:'Grasa',
                            icon:'pi pi-fw pi-pencil',
                            command: () => { 
                                this.selectFacialDrawType('darkblue');
                            }
                        },
                        {
                            label:'Goma Borrar',
                            icon:'pi pi-eraser',
                            command: () => { 
                                this.selectFacialDrawType('white');
                            }
                        }
                    ]
                },
                {
                    label:'Finalizar',
                    icon:'pi pi-fw pi-file',
                    command: () => { 
                        this.saveFacialDraw();
                    }
                },
                {
                    separator:true
                },
                {
                    label:'Borrar Todo',
                    icon:'pi pi-fw pi-trash',
                    command: () => { 
                        this.eraseFacialDraw();
                    }
                }
            ]
        }
        return [];
    }
}
