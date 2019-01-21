import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should generate phone numbers after page loads', fakeAsync(() => {
    component.ngOnInit();
    tick(100);

    expect(component.phoneNumbers.length).toBeTruthy();
  }));

  it('should generate phone numbers according to amount', fakeAsync(() => {
    component.ngOnInit();
    tick(100);

    const amountOfNumbers = 10;
    component.numberForm.patchValue({ amountOfNumbers });

    const element = fixture.debugElement;

    const generateBtn = element.query(By.css('.has-addons button'));
    generateBtn.nativeElement.click();
    tick(100);
    expect(component.phoneNumbers.length).toEqual(amountOfNumbers);
  }));

  it('should not generate phone numbers if maximum amount is exceeded', fakeAsync(() => {
    component.numberForm.patchValue({ amountOfNumbers: 10005 });
    component.ngOnInit();
    tick(100);
    expect(component.phoneNumbers.length).toBeFalsy();
  }));

  it('should sort numbers based on selected sort field', fakeAsync(() => {
    const element = fixture.debugElement;

    component.numberForm.patchValue({ amountOfNumbers: 2, sortState: 'asc' });
    component.ngOnInit();
    tick(100);

    const ascendingSortFirst = component.phoneNumbers[0];

    component.numberForm.patchValue({ sortState: 'desc' });
    const select = element.query(By.css('select')).nativeElement;
    select.value = select.options[0].value;
    select.dispatchEvent(new Event('change'));

    const descendingSortFirst = component.phoneNumbers[0];

    expect(ascendingSortFirst).not.toEqual(descendingSortFirst);
  }));

  it('should call saveNumbers when Save list to file button is clicked', fakeAsync(() => {
    component.ngOnInit();
    tick(100);

    const element = fixture.debugElement;
    spyOn(component, 'saveNumbers');

    element.query(By.css('.save button')).nativeElement.click();

    expect(component.saveNumbers).toHaveBeenCalled();
  }));

});
