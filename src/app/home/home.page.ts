import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";

declare let Pusher;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pusher: any;
  blueWidth: string;
  redWidth: string;
  blueTeamPoints: number;
  redTeamPoints: number;
  team: any;
  btnColor: string;

  constructor(
    private http: HttpClient,
    private storage:Storage
  ) {
    this.team=false
    this.btnColor=''
    this.storage.get('team').then(
      r=>{
        if(r!='red' && r!='blue'){
          r = (Math.floor(Math.random() * 2) + 1)  == 1 ? 'red':'blue'
          this.storage.set('team',r)
        }
        this.team = r
        this.btnColor = r=='red'?'danger':'primary'
      }
    )

    this.blueTeamPoints=0
    this.redTeamPoints=0
    this.redWidth="60%"
    this.blueWidth="40%"
    this.pusher = new Pusher('9e682d6958fc4c8493ee', {
      cluster: "eu",
    });
    
    var channel = this.pusher.subscribe("cometa")   
    channel.bind("game", (data) => {
      // Recibir {red:100,blue:50}
      console.log('data>>',data)
      this.calculatePercent(data)
    }) 

  }

  ionViewWillEnter() {
    this.http.post("domain/endpoint/", { observe: "response" }).subscribe(// TODO recibo {red:100,blue:50}
      r => {
        console.log('r es',r)
        this.calculatePercent(r)
      }
    )
  }

  calculatePercent(data){
    var total = data.red+data.blue
    var redPercent = 100*data.red / total
    var bluePercent = 100-redPercent
    this.redWidth = redPercent+'%'
    this.blueWidth = bluePercent+'%'
  }
}
