import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { AvatarModule } from 'primeng/avatar';
import { BusDepot } from 'src/app/shared/interfaces/bus-depot.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';


@Component({
  standalone: true,
  imports: [
    PrimeNgModule,
    AvatarModule,
  ],
  selector: 'app-google-map-marker-edit',
  templateUrl: './google-map-marker-edit.component.html',
  styleUrls: ['./google-map-marker-edit.component.scss']
})
export class GoogleMapMarkerEditComponent implements OnInit {
  private _cdr = inject(ChangeDetectorRef);
  private markers: google.maps.Marker[] = [];
  private map: google.maps.Map | null = null;
  private currentZoom = 7;

  @Input() set busDepot(value: BusDepot | null) {
    if (value !== null) {
      setTimeout(() => {
        this.loadMapAndHandleWarehouseData(value);
      });
    }
  }

  @Output() getMarker = new EventEmitter<any>();


  constructor() { }
  loader: any;
  ngOnInit() {
    this.loader = new Loader({
      apiKey: 'AIzaSyDglRp7c826ACLp5ReGlVPCA1lbunxrZHA', // Replace with your Google Maps API key
      version: 'weekly',
    });

    this.loader.load().then(() => {
      this.initializeMap();
    });

    window.addEventListener('resize', () => {
      if (this.map) {
        setTimeout(() => {
          google.maps.event.trigger(this.map!, 'resize');
        }, 100);
      }
    });
  }

  private loadMapAndHandleWarehouseData(busDepot: BusDepot) {
    // this.loader.load().then(() => {
    // this.initializeMap();
    this.handleWarehouseData(busDepot);
    // });
  }


  private removeMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null); // Remove the marker from the map
    }
    this.markers = []; // Clear the markers array
  }

  private initializeMap() {
    const mapElement = document.getElementById('mapEdit');
    if (!mapElement) {
      console.error('Map container element not found.');
      return;
    }
    this.map = new google.maps.Map(mapElement, {
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
        },

      ],
      scrollwheel: false,
    });

    // this.warehouse$.subscribe((warehouseData: Warehouse) => {
    //   this.handleWarehouseData(warehouseData);
    // });

    const customMarkerIcon = {
      url: 'assets/images/religion.png',
      scaledSize: new google.maps.Size(80, 80),
    };

    const thailandBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(5.61, 97.34), // Southwest corner of Thailand
      new google.maps.LatLng(20.46, 105.64) // Northeast corner of Thailand
    );

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();
        console.log(thailandBounds);
        console.log(event);
        // Check if the clicked location is within Thailand bounds
        if (thailandBounds.contains(event.latLng)) {
          // Create a marker with the custom icon at the clicked location
          const newMarker = new google.maps.Marker({
            position: event.latLng,
            map: this.map,
            icon: customMarkerIcon,
            title: 'Custom Marker',
          });

          // Remove old markers from the map and array
          this.removeMarkers();

          // Now you can use clickedLat and clickedLng as the latitude and longitude of the clicked location
          console.log('Clicked Latitude:', clickedLat);
          console.log('Clicked Longitude:', clickedLng);
          let LP = {
            lat: clickedLat,
            lng: clickedLng
          }

          this.getMarker.emit(LP)

          // Store the new marker in the markers array
          this.markers.push(newMarker);
        } else {
          console.log('Clicked location is outside of Thailand bounds. Marker not created.');
        }
      } else {
        console.log('Click event did not provide a valid LatLng.');
      }
    });

  }

  private handleWarehouseData(warehouseData: BusDepot) {
    if (!warehouseData || warehouseData.depotLat === undefined || warehouseData.depotLong === undefined) {
      return; // Skip invalid warehouse data
    }

    const lat = parseFloat(warehouseData.depotLat.toString());
    const lng = parseFloat(warehouseData.depotLong.toString());

    if (isNaN(lat) || isNaN(lng)) {
      return; // Skip invalid latitude or longitude
    }
    this.removeMarkers();
    const customMarkerIcon = {
      url: 'assets/images/religion.png', // URL to your marker icon image
      scaledSize: new google.maps.Size(80, 80),
    };

    // Create a marker with the custom icon at the specified position
    const marker = new google.maps.Marker({
      position: { lat, lng }, // Set the marker position
      map: this.map, // Specify the map where the marker should be displayed
      icon: customMarkerIcon, // Use the custom marker icon
      title: 'Your Marker Title', // Set a title for the marker (optional)
    });
    this.markers.push(marker)
    // Add the marker to the map
    // marker.setMap(this.map);



    this.smoothZoomToLocation(lat, lng, 15); // You can set the desired zoom level here
    this._cdr.detectChanges()
  }
  smoothZoomToLocation(lat: number, lng: number, targetZoom: number) {
    if (!this.map) {
      return;
    }
    const currentZoom = this.map.getZoom();
    const targetLatLng: google.maps.LatLngLiteral = { lat, lng };
    const duration = 1000;
    const fps = 60;
    const frameDuration = 1000 / fps;
    let startTimestamp: number | null = null;
    const animateZoom = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const newZoom = currentZoom! + (targetZoom - currentZoom!) * progress;
        const center = this.map!.getCenter();
        if (center) {
          const newCenter: google.maps.LatLngLiteral = {
            lat: center.lat() + (targetLatLng.lat - center.lat()) * progress,
            lng: center.lng() + (targetLatLng.lng - center.lng()) * progress
          };

          this.map!.setZoom(newZoom);
          this.map!.panTo(newCenter);
        }
        requestAnimationFrame(animateZoom);
      } else {
        this.map!.setZoom(targetZoom);
        this.map!.panTo(targetLatLng);
      }
    };

    requestAnimationFrame(animateZoom);
  }






}
