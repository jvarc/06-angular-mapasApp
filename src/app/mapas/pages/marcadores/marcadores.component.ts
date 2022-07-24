import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color  : string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
      width: 100%;
      height: 100%;
      }
      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
      }
      li{
        cursor: pointer;
      }

    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-15.452894536004823, 27.839369946019197 ]

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();

    //con este codigo se puede cambiar el icono del marcador
    /*const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'hola mundo';

    const marker = new mapboxgl.Marker({
      element: markerHtml
    })
      .setLngLat(this.center)
      .addTo(this.mapa);*/

  }

  irMarcador(marcador: MarcadorColor) {
   this.mapa.flyTo({
    center: marcador.marker!.getLngLat()
   })
  }

  agregarMarcador(){

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center)
      .addTo( this.mapa);

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })
  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr: any[] = [];

    this.marcadores.forEach( m => {

      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('marcadores',JSON.stringify(lngLatArr))
  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa)

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      })
    });
  }

  borrarMarcador( i: number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1)
    this.guardarMarcadoresLocalStorage()
  }
}
