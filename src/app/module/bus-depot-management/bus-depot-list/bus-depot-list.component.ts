import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { GoogleMapMarkerEditComponent } from 'src/app/shared/components/google-map-marker-edit/google-map-marker-edit.component';
import { BusDepot } from 'src/app/shared/interfaces/bus-depot.interface';
import { Fare } from 'src/app/shared/interfaces/fare.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { GoogleMapMarkerAddComponent } from '../../../shared/components/google-map-marker-add/google-map-marker-add.component';

import { BusDepotService } from '../service/bus-depot.service';

@Component({
  standalone: true,
  selector: 'app-bus-depot-list',
  imports: [PrimeNgModule, SharedAppModule, GoogleMapMarkerAddComponent, GoogleMapMarkerEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bus-depot-list.component.html',
  providers: [ConfirmationService,]
})

export class BusDepotListComponent implements OnInit {
  private _service = inject(BusDepotService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toastService = inject(ToastService);
  searchText!: string | null;
  dataTable: BusDepot[] = [];
  sidebar: boolean = false;
  registerForm!: FormGroup;
  submittedForm$ = new BehaviorSubject<boolean>(false);
  actionStatus: string = "save";
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }


  private markers: google.maps.Marker[] = [];
  private map: google.maps.Map | null = null;
  private currentZoom = 10;


  loader: any;
  ngOnInit() {
    this.search()
    this.createForm()
    this.loader = new Loader({
      apiKey: 'AIzaSyDglRp7c826ACLp5ReGlVPCA1lbunxrZHA', // Replace with your Google Maps API key
      version: 'weekly',
    });

    window.addEventListener('resize', () => {
      if (this.map) {
        setTimeout(() => {
          google.maps.event.trigger(this.map!, 'resize');
        }, 100);
      }
    });


  }
  createForm(): void {
    this.registerForm = this.fb.group({
      busDepotId: new FormControl<number | null>(null),
      depotName: new FormControl<string | null>(null, Validators.required),
      depotLat: new FormControl<string | null>(null, Validators.required),
      depotLong: new FormControl<string | null>(null, Validators.required),
    });
  }

  getMarker(data: any) {
    this.registerForm.get('depotLat')?.patchValue(data.lat)
    this.registerForm.get('depotLong')?.patchValue(data.lng)
  }


  search() {
    this._service.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataTable = data['data']
        this.loader.load().then(() => {
          this.initializeMap();
          this.loadMarkers()
        });

        setTimeout(() => {
          this.zoomIn()
        }, 500);
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }


  getDataInput(data: any) {
    return data.target.value
  }

  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control?.invalid && (!!control?.touched || (!!control?.untouched && this.submittedForm$.value));
  }


  openSidebar(): void {
    this.sidebar = true;
    this.actionStatus = "save"
    this.createForm()
  }

  openSidebarEdit(busDepot: BusDepot): void {
    this.registerForm.patchValue(busDepot)
    this.actionStatus = "edit"
    this.sidebar = true;
  }

  onCloseAction(): void {
    this.sidebar = false;
  }


  validateForm(): void {
    if (this.registerForm.invalid) {
      this.handleInvalidForm();
      return;
    }

    this.submittedForm$.next(false);
    this.save()
  }

  save(): void {
    if (this.registerForm.valid) {
      this._service.save(this.registerForm.value, this.actionStatus).subscribe({
        next: (response: any) => {
          const data: any = response;
          this.handleSaveSuccess();

          // setTimeout(() => {
          this.zoomIn()
          // }, 500);
        },
        error: (err) => {

        }
      });
    }
  }
  confirmDelete(busDepot: BusDepot) {
    this.confirmationService.confirm({
      header: 'ยืนยันการลบข้อมูลอู่รถเมล์',
      message: `ต้องการลบข้อมูลอู่รถเมล์ ${busDepot.depotName} ใช่หรือไม่`,
      icon: 'pi pi-trash',
      accept: () => {
        this.delete(busDepot.busDepotId)
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }


  delete(id: number): void {
    this._service.delete(id).subscribe({
      next: (response: any) => {
        const data: any = response;
        this.handleDeleteSuccess();
      },
      error: (err) => {
        this._toastService.addSingle('error', 'แจ้งเตือน', 'ไม่สามารถลบข้อมูลได้เนื่องจากกองปฏิบัติการเดินรถถูกใช้งานอยู่!');
      }
    });
  }

  private handleSaveSuccess(): void {
    this.onCloseAction();
    this.search();
    this._toastService.addSingle('success', 'แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
  }

  private handleInvalidForm(): void {
    this.submittedForm$.next(true);
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'โปรดกรอกข้อมูลให้ครบถ้วน!');
  }

  private handleDeleteSuccess(): void {
    this.onCloseAction();
    this.search();
    this._toastService.addSingle('success', 'แจ้งเตือน', 'ลบข้อมูลสำเร็จ');
  }




  // <------------ google map --------------->



  private initializeMap() {
    this.map = new google.maps.Map(document.getElementById('mapDepot')!, {
      center: { lat: 13.787204731602454, lng: 100.58050587773323 }, // Bangkok
      zoom: this.currentZoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' } // Hide labels for all points of interest (POI)
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels',
          stylers: [
            { visibility: 'on' } // Show labels for parks (customize this)
          ]
        },
        {
          featureType: 'landscape.man_made',
          elementType: 'geometry',
          stylers: [
            { visibility: 'off' } // Hide man-made landmarks
          ]
        }
      ]
    });
  }

  zoomIn() {
    if (this.map && this.currentZoom < 20) {
      this.map.setZoom(this.currentZoom);
    }
  }

  private clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers.length = 0;
  }


  private loadMarkers() {
    console.log("sss");

    this.clearMarkers()
    this.renderOnMap(this.dataTable)
  }

  private renderOnMap(busDepots: BusDepot[]) {
    busDepots.forEach(busDepot => {
      const customMarkerIcon = {
        url: 'assets/images/religion.png',
        scaledSize: new google.maps.Size(80, 80),
      };

      const redMarker = new google.maps.Marker({
        position: { lat: Number(busDepot.depotLat), lng: Number(busDepot.depotLong) },
        map: this.map,
        icon: customMarkerIcon,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div>
      <div>${busDepot.depotName}</div>
    </div>`
      });

      redMarker.addListener('click', () => {
        infoWindow.open(this.map, redMarker);
      });

      // Add a listener to open the InfoWindow when the marker is hovered over
      redMarker.addListener('mouseover', () => {
        infoWindow.open(this.map, redMarker);
      });

      // Add a listener to close the InfoWindow when the close button is clicked
      google.maps.event.addListener(infoWindow, 'domready', () => {
        const closeBtn = document.getElementById('closeInfoWindow');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            infoWindow.close();
          });
        }
      });

      // Add a listener to close the InfoWindow when the marker is hovered out
      redMarker.addListener('mouseout', () => {
        infoWindow.close();
      });

      this.markers.push(redMarker);

      if (this.map) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(redMarker.getPosition()!);
        this.map.fitBounds(bounds);
      }
    });

    setTimeout(() => {
      this.zoomIn();
    }, 500);
  }

}
