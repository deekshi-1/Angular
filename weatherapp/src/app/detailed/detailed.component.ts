import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_KEY = environment.API_KEY;
const API_URL = environment.API_URL;

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css'],
})
export class DetailedComponent implements OnInit {
  add = true;
  added = false;
  celclass = true;
  city: any;
  detail: any;
  temp: any;
  farenclass = false;
  mintemp: any;
  maxtemp: any;
  icon: any;
  fav: any;
  flag: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.city = localStorage.getItem('city');
    this.city = JSON.parse(this.city);
    this.http
      .get(`${API_URL}/weather?q=${this.city}&appid=${API_KEY}`)
      .subscribe((data) => {
        this.detail = data;
        console.log(this.detail);
        this.icon = `http://openweathermap.org/img/wn/${this.detail['weather'][0].icon}@4x.png`;
      });
  }

  addToFav() {
    this.fav = localStorage.getItem('fav');
    this.fav = JSON.parse(this.fav) || [];
    this.flag = 0;
    for (let item of this.fav) {
      if (this.detail.name.toLowerCase() == item.name.toLowerCase()) {
        this.flag = 1;
        break;
      }
    }
    if (this.flag == 0) {
      this.fav.unshift(this.detail);
      localStorage.setItem('fav', JSON.stringify(this.fav));
    }
    this.add = false;
    this.added = true;
  }

  remove() {
    this.add = true;
    this.added = false;
    console.log('Remove');
    let curr: any = [];
    this.fav = localStorage.getItem('fav');
    this.fav = JSON.parse(this.fav);
    console.log(this.fav);
    for (let item of this.fav) {
      if (this.detail.name.toLowerCase() != item.name.toLowerCase()) {
        curr.push(item);
      }
    }
    console.log(curr);
    
    localStorage.setItem('fav', JSON.stringify(curr));
  }

  celc() {
    this.celclass = true;
    this.farenclass = false;
  }
  faren() {
    this.celclass = false;
    this.farenclass = true;
  }
  val() {
    this.temp = this.detail.main.temp - 273;

    if (this.celclass) {
      this.maxtemp = this.detail.main.temp_max - 273;
      this.mintemp = this.detail.main.temp_min - 273;
      return this.temp;
    } else {
      this.maxtemp = (this.maxtemp * 9) / 5 + 32;
      this.mintemp = (this.mintemp * 9) / 5 + 32;
      return (this.temp * 9) / 5 + 32;
    }
  }

  check() {
    this.fav = localStorage.getItem('fav');
    this.fav = JSON.parse(this.fav);
    this.flag = 0;
    if (this.fav == null) {
      this.add = true;
      this.added = false;
    } else {
      for (let item of this.fav) {
        if (this.detail.name.toLowerCase() == item.name.toLowerCase()) {
          this.flag = 1;
          break;
        }
      }
      if (this.flag == 1) {
        this.add = false;
        this.added = true;
      } else {
        this.add = true;
        this.added = false;
      }
    }
  }
}
