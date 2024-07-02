import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { AvatarModule } from 'primeng/avatar';
import { PrimeNgModule } from 'src/app/shared/primeng.module';

@Component({
  standalone: true,
  imports: [
    PrimeNgModule,
    AvatarModule,
  ],
  selector: 'app-google-map-marker-add',
  templateUrl: './google-map-marker-add.component.html',
  styleUrls: ['./google-map-marker-add.component.scss']
})
export class GoogleMapMarkerAddComponent implements OnInit {
  private _cdr = inject(ChangeDetectorRef);
  private markers: google.maps.Marker[] = [];
  private map: google.maps.Map | null = null;
  private currentZoom = 12;
  @Output() getMarker = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    const loader = new Loader({
      apiKey: 'AIzaSyDglRp7c826ACLp5ReGlVPCA1lbunxrZHA', // Replace with your Google Maps API key
      version: 'weekly',
    });

    loader.load().then(() => {
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

  private removeMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null); // Remove the marker from the map
    }
    this.markers = []; // Clear the markers array
  }

  private initializeMap() {
    const mapElement = document.getElementById('mapAdd');
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






}
