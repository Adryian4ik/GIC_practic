import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ApiService } from '../services/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import "@geoman/leaflet-geoman-free";
import { Expansion } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './main.component.html',
  providers: [
    DatePipe,
    CookieService
  ],
  styleUrl: './main.component.css'
})
export class MainComponent {


  myIcon = L.icon({
      iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII='
  });

  constructor(private api: ApiService, public datePipe: DatePipe, private cookieService: CookieService, private router: Router){


    let cookie = this.cookieService.get('access');
    
    let exp = new Date(parseInt(cookie));

    if (cookie == "" || exp < new Date(Date.now())){
      this.router.navigate(['/sign_in']);
    }

    this.updateTaskList();
  }

  logout(){
    this.cookieService.delete('access');
    this.router.navigate(['/sign_in']);

  }

  actualChange(){
    this.taskSelect(0);

    this.updateTaskList();
  }

  taskSelect(index: number){

    this.selectedTaskIndex = index;
    if (this.marker != null){
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    
    this.descriptionsList = [];
    
    if (this.taskList.length==0) {
      return;
    }

    if (this.taskList[index].lat != null){
      this.marker = L.marker([this.taskList[index].lat!, this.taskList[index].long!], {icon: this.myIcon});
      this.marker.addTo(this.map);
      this.map.flyTo([this.taskList[index].lat!, this.taskList[index].long!], 17);
    }


    this.api.getDescription(this.taskList[index].id).subscribe((response: any) => {
      response.forEach((description:any) => {


        this.descriptionsList.push({
          id: description.id,
          text: description.text,
          datetime: description.datetime
        })
      });
    });


  }

  descriptionText: string = "";

  addDescription(){
    if (this.descriptionText.trim() == ""){
      return;
    }

    this.api.addDescription(this.descriptionText.trim(), this.taskList[this.selectedTaskIndex].id).subscribe((response: any)=>{
      this.taskSelect(this.selectedTaskIndex);
    });


    this.descriptionText = "";
  }


  changeTaskActual(index: number){
    this.api.changeActual(this.taskList[this.selectedTaskIndex].id, this.archiveFlag).subscribe((response: any)=>{
      this.updateTaskList();
    });
  }


  updateTaskList(){
    this.api.getTaskList(!this.archiveFlag).subscribe((response: any) => {
      this.taskList = [];
      response.forEach((task:any) => {



        this.taskList.push({
          id: task.id,
          date: task.date,
          lat: task.lat,
          long: task.long,
          actual: task.actual,
          name: task.name
        })
      });
    });
  }

  dateToString(date: number){
    return (new Date(date * 1000)).toLocaleDateString('ru', {year:"numeric", month:"numeric", day:"numeric"});
  }



  marker: any = null;
  map: any;
  tabIndex: number = 0;
  taskList:Task[] = [];
  selectedTaskIndex: number = 0;
  descriptionsList:Description[] = [];
  archiveFlag: boolean = false;

  NgOnInit(): void{
    

  }

  ngAfterViewInit(): void{
    this.map = L.map('map', {
      center: [52.093754, 23.685107],
      zoom: 15
    });
    this.map.attributionControl.setPrefix('');

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

  }

  addMode: boolean = false;
  // layerForPoint = L.featureGroup();
  workingLayer : L.Layer | undefined = undefined;
  point: L.LatLng | undefined = undefined;

  date : string = this.datePipe.transform(new Date(),'yyyy-MM-dd')!;

  addTask(){
    this.addMode = true;
    if (this.marker == null) return;
    this.map.removeLayer(this.marker);

    this.marker = null;
  }

  name: string = "";

  saveTask(){

    let name = this.name.trim();
    let date = this.date;
    let lat = this.point?.lat ?? null;
    let lng = this.point?.lng ?? null;


    if (name == "")return;

    if (date == "") return;

    console.log(name, lat, lng, new Date(date!));
    this.api.addTask(name, lat, lng, new Date(date!)).subscribe((response: any)=>{
      this.updateTaskList();
    });

    this.addMode = false;

  }

  pointSelect(){
    if (this.point != undefined) return;
    this.map.pm.enableDraw('Marker');
    this.map.on("pm:create",  (e: any) => {
      console.log(e);

      let lalng = e.marker.getLatLng()
      let precission = 8;
      this.point = L.latLng(lalng.lat.toFixed(precission), lalng.lng.toFixed(precission));
      this.map.removeLayer(e.marker);

      this.map.pm.disableDraw('Marker');
      this.marker = L.marker([this.point!.lat, this.point!.lng], {icon: this.myIcon});
      this.marker.addTo(this.map);



      this.map.off("pm:create");
      
    });
  }

  deletePoint(){
    this.point = undefined;
    this.map.removeLayer(this.marker);
    this.marker = null;
  }

}



interface Task{
  id: string;
  date: number;
  lat: number | null;
  long: number | null;
  actual: boolean;
  name: string;

}

interface Description{
  id: string;
  text: string;
  datetime: number;
}