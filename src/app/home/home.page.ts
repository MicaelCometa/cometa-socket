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
    private storage: Storage
  ) {
    this.team = false
    this.btnColor = ''
    this.storage.get('team').then(
      r => {
        if (r != 'red' && r != 'blue') {
          r = (Math.floor(Math.random() * 2) + 1) == 1 ? 'red' : 'blue'
          this.storage.set('team', r)
        }
        this.team = r
        this.btnColor = r == 'red' ? 'danger' : 'primary'
      }
    )

    this.blueTeamPoints = 0
    this.redTeamPoints = 0
    this.redWidth = "50%"
    this.blueWidth = "50%"
    this.pusher = new Pusher('9e682d6958fc4c8493ee', {
      cluster: "eu",
    });

    var channel = this.pusher.subscribe("cometa")
    channel.bind("game", (r) => {
      var data = r.results
      this.prepareStats(data)
    })

  }

  ionViewWillEnter() {
    this.http.get("https://talk.cometa.app/game/stats", { observe: "response" }).subscribe(
      r => {
        var data: any = r.body
        this.prepareStats(data)
      }
    )
  }

  sendPoint() {
    var data = {
      color: this.team == 'red' ? 'rojo' : 'azul'
    }
    this.http.post("https://talk.cometa.app/game/add", data, { observe: "response" }).subscribe(
      r => {
        var data: any = r.body
        this.prepareStats(data)
      })
  }

  prepareStats(data) {
    var stats = {
      red: 0,
      blue: 0
    }
    if (data[0].color == 'rojo') {
      stats.red = parseInt(data[0].value)
      stats.blue = parseInt(data[1].value)
    } else {
      stats.red = parseInt(data[2].value)
      stats.blue = parseInt(data[0].value)
    }
    this.calculatePercent(stats)
  }

  calculatePercent(data) {
    var total = data.red + data.blue
    this.redTeamPoints = data.red
    this.blueTeamPoints = data.blue
    var redPercent = 100 * data.red / total
    var bluePercent = 100 - redPercent
    this.redWidth = redPercent + '%'
    this.blueWidth = bluePercent + '%'
  }
}
