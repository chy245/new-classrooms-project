import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //declare variables
  private jsonData: any;
  private file: any;
  private _numOfUsers: number;
  private numOfFemales: number;
  private numOfMales: number;
  private firstNames: any;
  private lastNames: any;
  private popInState: any;
  private sortedPopInState: any[];
  private femalesInState: any;
  private malesInState: any;
  private ageRange: number[];
  private topStates: string[];
  private sumInTopStates: number;
  private sumFemalesInTopStates: number;
  private sumMalesInTopStates: number;

  private _data: any[];
  private _labels: any[];
  private legends: boolean[];

  dataGenerated: boolean = false;
  dataObservable = new BehaviorSubject<boolean>(this.dataGenerated);

  get numOfUsers(): number {
    return this._numOfUsers;
  }

  get data(): any[] {
    return this._data;
  }

  get labels(): any[] {
    return this._labels;
  }

  constructor() { }

  //Parse submitted text as JSON
  submitJsonAsText(jsonText: string) {
    this.jsonData = JSON.parse(jsonText);
    this.process();
  }

  //Read uploaded file and parse as JSON
  submitJsonAsFile(file) {
    this.file = file;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.submitJsonAsText(fileReader.result);
    };

    fileReader.readAsText(file);

  }

  //Calculate the necessary statistics
  private process() {
    this._numOfUsers = 0;
    this.numOfFemales = 0;
    this.numOfMales = 0;
    this.firstNames = {AtoM: 0, NtoZ: 0};
    this.lastNames = {AtoM: 0, NtoZ: 0};
    this.popInState = {};
    this.sortedPopInState;
    this.femalesInState = {};
    this.malesInState = {};
    this.ageRange = [0, 0, 0, 0, 0, 0];
    this.topStates = [];
    this.sumInTopStates = 0;
    this.sumFemalesInTopStates = 0;
    this.sumMalesInTopStates = 0;
    const results = this.jsonData.results;

    for(let i in results) {
      const gender = results[i].gender;
      const firstName = results[i].name.first;
      const lastName = results[i].name.last;
      const state = results[i].location.state;
      const age = parseInt(results[i].dob.age);

      this._numOfUsers++;

      firstName.charAt(0) >= 'a' && firstName.charAt(0) <= 'm' ? this.firstNames.AtoM++ : this.firstNames.NtoZ++;
      lastName.charAt(0) >= 'a' && lastName.charAt(0) <= 'm' ? this.lastNames.AtoM++ : this.lastNames.NtoZ++;

      this.popInState[state] == null ? this.popInState[state] = 1 : this.popInState[state]++;
      this.sortedPopInState = this.sortProperties(this.popInState);

      if(gender === 'female') {
        this.numOfFemales++;
        this.femalesInState[state] == null ? this.femalesInState[state] = 1 : this.femalesInState[state]++;

      } else {
        this.numOfMales++;
        this.malesInState[state] == null ? this.malesInState[state] = 1 : this.malesInState[state]++;
      }

      if(age >= 0 && age <= 20) {
        this.ageRange[0]++;
      } else if(age <= 40) {
        this.ageRange[1]++;
      } else if(age <= 60) {
        this.ageRange[2]++;
      } else if(age <= 80) {
        this.ageRange[3]++;
      } else if(age <= 100) {
        this.ageRange[4]++;
      } else if(age > 100) {
        this.ageRange[5]++;
      }
    }

    for(let i = 0; i < 10; i++) {
      let state = this.sortedPopInState[i][0]

      this.topStates.push(state);
      this.sumInTopStates += this.sortedPopInState[i][1];

      this.sumFemalesInTopStates += this.check(this.femalesInState[state]);
      this.sumMalesInTopStates+= this.check(this.malesInState[state]);
    }

    this.generateChartData();
    this.dataObservable.next(true);
  }

  //Generate the info for the charts
  private generateChartData() {
    this._data = [
      [this.numOfFemales, this.numOfMales],
      [this.firstNames.AtoM, this.firstNames.NtoZ],
      [this.lastNames.AtoM, this.lastNames.NtoZ],
      [this.sortedPopInState[0][1], this.sortedPopInState[1][1], this.sortedPopInState[2][1], this.sortedPopInState[3][1],
        this.sortedPopInState[4][1], this.sortedPopInState[5][1], this.sortedPopInState[6][1], this.sortedPopInState[7][1],
        this.sortedPopInState[8][1], this.sortedPopInState[9][1], this.numOfUsers - this.sumInTopStates],
      [this.check(this.femalesInState[this.topStates[0]]), this.check(this.femalesInState[this.topStates[1]]), this.check(this.femalesInState[this.topStates[2]]),
        this.check(this.femalesInState[this.topStates[3]]), this.check(this.femalesInState[this.topStates[4]]), this.check(this.femalesInState[this.topStates[5]]),
        this.check(this.femalesInState[this.topStates[6]]), this.check(this.femalesInState[this.topStates[7]]), this.check(this.femalesInState[this.topStates[8]]),
        this.check(this.femalesInState[this.topStates[9]]), this.numOfFemales - this.sumFemalesInTopStates],
      [this.check(this.malesInState[this.topStates[0]]), this.check(this.malesInState[this.topStates[1]]), this.check(this.malesInState[this.topStates[2]]),
        this.check(this.malesInState[this.topStates[3]]), this.check(this.malesInState[this.topStates[4]]), this.check(this.malesInState[this.topStates[5]]),
        this.check(this.malesInState[this.topStates[6]]), this.check(this.malesInState[this.topStates[7]]), this.check(this.malesInState[this.topStates[8]]),
        this.check(this.malesInState[this.topStates[9]]), this.numOfMales - this.sumMalesInTopStates],
      this.ageRange
    ];

    this._labels = [
      ['Number of females', 'Number of males'],
      ['First names from A-M', 'First names from N-Z'],
      ['Last names from A-M', 'Last names from N-Z'],
      [this.topStates[0], this.topStates[1], this.topStates[2], this.topStates[3], this.topStates[4], this.topStates[5],
        this.topStates[6], this.topStates[7], this.topStates[8], this.topStates[9], 'Others'],
      [this.topStates[0], this.topStates[1], this.topStates[2], this.topStates[3], this.topStates[4], this.topStates[5],
        this.topStates[6], this.topStates[7], this.topStates[8], this.topStates[9], 'Others'],
      [this.topStates[0], this.topStates[1], this.topStates[2], this.topStates[3], this.topStates[4], this.topStates[5],
        this.topStates[6], this.topStates[7], this.topStates[8], this.topStates[9], 'Others'],
      ['0-20', '21-40', '41-60', '61-80', '81-100', '100+']
    ];

    this.dataGenerated = true;
  }

  //Sort an object by the value of its properties
  private sortProperties(obj)
  {
    let sortable = [];

    for(let key in obj) {
      if(obj.hasOwnProperty(key)) {
        sortable.push([key, obj[key]]);
      }
    }

    sortable.sort((a, b) => { return b[1] - a[1] });

    return sortable;
  }

  private check(num): number {
    return isNaN(num) ? 0 : num;
  }
}
