import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-submit-json',
  templateUrl: './submit-json.component.html',
  styleUrls: ['./submit-json.component.css']
})
export class SubmitJsonComponent implements OnInit {

  @Input() jsonText: string;
  submitted: boolean = false;
  file: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  submitJson() {
    this.dataService.submitJsonAsText(this.jsonText);
    this.submitted = true;
  }

  fileChanged(event) {
    this.file = event.target.files[0];
    this.dataService.submitJsonAsFile(this.file);
    this.submitted = true;
  }

}
