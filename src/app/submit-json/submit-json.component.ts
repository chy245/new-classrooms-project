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

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  submitJson() {
    console.log('json submitted');
    this.submitted = true;
  }

  fileUploaded() {
    console.log('file uploaded');
    this.submitted = true;
  }

}
