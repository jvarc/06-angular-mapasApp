import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
  `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row {
      background-color: white;
      bottom: 50px;
      left: 50px;
      border-radius: 5px;
      position: fixed;
      z-index: 999;
    }
  `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map;
  zoomLevel: number = 17;
  center: [number, number] = [-15.450968424849231, 27.84070284464866 ]

  constructor() { }
  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=> {});
    this.mapa.off('zoomend', ()=> {});
    this.mapa.off('move', ()=> {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom()
    });

    this.mapa.on('zoomend', (ev) => {
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18)
      }
    })

    this.mapa.on('move', (ev) =>{
      const {lng, lat} = ev.target.getCenter();
      this.center = [lng, lat];
    })
  }

  zoomCambio( zoomInput: string){
    this.mapa.zoomTo(Number(zoomInput))
  }
  zoomIn(){
    this.mapa.zoomIn();
  };

  zoomOut(){
    this.mapa.zoomOut();
  }

}
