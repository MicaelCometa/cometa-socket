import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage:Storage) {

    this.storage.get('team').then(
      r=>{
        if(r!='red' && r!='blue'){
          let team = (Math.floor(Math.random() * 2) + 1)  == 1 ? 'red':'blue'
          this.storage.set('team',team)
        }
      }
    )

  }
}
