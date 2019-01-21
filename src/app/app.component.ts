import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  phoneNumbers: number[] = [];
  maxAmount = 10000;
  sortState = 'asc';

  generatingNumbers = false;
  maxAmountExceeded = false;

  numberForm: FormGroup;

  constructor() {
    this.numberForm = new FormGroup({
      amountOfNumbers: new FormControl(100),
      sortState: new FormControl('asc'),
    });
  }

  ngOnInit() {
    this.generateNumbers();
  }

  generateNumbers() {
    this.setFormState();
    const { amountOfNumbers } = this.numberForm.value;

    if (amountOfNumbers > this.maxAmount) {
      this.setFormState(false, true);
      return;
    }

    const phoneDigitsLength = 1000000000;
    const randomMin = 0.1;
    const randomMax = 1;

    const phoneNumbers = [];

    setTimeout(() => {
      for (let i = 0; i < amountOfNumbers; i += 1) {
        const randomNumber = Math.random() * (randomMax - randomMin) + randomMin;
        const numberToAdd = Math.floor(randomNumber * phoneDigitsLength);

        phoneNumbers.push(Math.floor(numberToAdd));
      }

      this.phoneNumbers = phoneNumbers;
      this.sortNumbers();

      this.setFormState(false, false);
    }, 100);
  }

  sortNumbers() {
    const { sortState } = this.numberForm.value;

    if (sortState === 'asc') {
      this.phoneNumbers.sort();
    } else {
      this.phoneNumbers = this.phoneNumbers.reverse();
    }
  }

  setFormState(generatingNumbers = true, maxAmountExceeded?) {
    this.generatingNumbers = generatingNumbers;
    this.maxAmountExceeded = maxAmountExceeded;
  }

  saveNumbers() {
    const blob = new Blob(
      this.phoneNumbers.map(number => `0${number.toString()}\n`),
      {type: 'text/plain;charset=utf-8'}
    );

    if (this.phoneNumbers.length) {
      return FileSaver.saveAs(blob, 'phone-numbers.txt');
    }
  }
}
