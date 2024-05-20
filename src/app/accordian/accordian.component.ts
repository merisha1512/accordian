// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ThemeModule } from 'src/app/theme/theme.module';
// import { PaymentsModule } from '../../payments.module';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


// @Component({
//   standalone: true,
//   imports: [
//     CommonModule,
//     ThemeModule,
//     PaymentsModule,
//     NgSelectModule,
//     NgbAccordionModule
//   ],
//   selector: 'app-accordian',
//   templateUrl: './accordian.component.html',
//   styleUrls: ['./accordian.component.scss']
// })
// export class AccordianComponent implements OnInit {

//   qcStatus =
//     [
//       {
//           id: 1,
//           name: "Stage 1",
//           disabled: false,
//           stages: [
//             { id: 1, process: "Pass" },
//             { id: 2, process: "Rejected" }
//           ]
//       },
//       {
        
//           id: 2,
//           name: "Stage 2",
//           disabled: true,
//           stages: [
//             { id: 1, process: "Pass" },
//             { id: 2, process: "Rejected" }
//           ]
//       }
//     ];



//   datas = [
//     {
//       id: 1,
//       name: "Yes"
//     },
//     {
//       id: 2,
//       name: "No"
//     }
//   ]

//   public qcForm: FormGroup = new FormGroup({});
//   public submitted: boolean = false;
//   variant: any = [];
//   process: any = [];
//   isDisabled: boolean[] = [];
//   form: any = [];

//   constructor(private fb: FormBuilder) {
//   }

//   ngOnInit(): void {
//     this.qcForm = this.fb.group({
//       reject: this.fb.array([]),
//     });
//   }

//   createFormGroup(value: string) {
//     return this.fb.group({
//       status: [null, (value == 'Rejected') ? [Validators.required] : []],
//       rejectReason: [null, (value == 'Rejected') ? [Validators.required] : []],
//       furtherProcess: [null, (value == 'Rejected') ? [Validators.required] : []],
//       comments: [''],
//       stage: [value]
//     });
//   }

//   get optionsForm(): FormArray {
//     return this.qcForm.get('reject') as FormArray;
//   }

//   selectStage(event: any,  index: number): void {
//     console.log(event);
//     this.process.push({ stage: "", status: [] });
//     this.process[index].stage = event.name;
//     this.process[index].status = event.stages
//     this.isDisabled[index] = true;
//     //enable this comment when drodpwn method otherwise it's not enabled
//     // this.qcStatus = this.qcStatus.filter((status)=>{ 
//     //   if(event.id == status.id){
//     //     status.disabled = true;
//     //   } else{
//     //    status.disabled = false;
//     //   }
//     //   return status;
//     // })
//     console.log(this.qcStatus);
//   }

//   selectProcess(event: any, index: number): void {
//     this.variant.push({ process: "" });
//     this.variant[index].process = event.process;
//     this.isDisabled[index] = true;
//     if (event.id == 2) {
//       this.optionsForm.push(this.createFormGroup('Rejected'));
//     } else {
//       this.optionsForm.push(this.createFormGroup('Pass'));
//     }
//   }

//   save() {
//     this.submitted = true;
//     if (this.optionsForm.status == "INVALID") {
//       console.log("error");
//     } else {
//       this.form = this.variant.map((item, index) => {
//         if (item.process == this.optionsForm.value[index].stage) {
//           return {
//             process: item.process,
//             rejectedForm: {
//               status: this.optionsForm.value[index].status,
//               furtherProcess: this.optionsForm.value[index].furtherProcess,
//               rejectReason: this.optionsForm.value[index].rejectReason,
//               comments: this.optionsForm.value[index].comments
//             }
//           }
//         }
//       });
//       console.log(this.form);
//     }
//   }

// }

// Using Angular Material
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ThemeModule } from 'src/app/theme/theme.module';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
        CommonModule,
    ThemeModule,
    NgSelectModule,
    NgbAccordionModule
  ],
  selector: 'app-accordian',
  templateUrl: './accordian.component.html',
  styleUrls: ['./accordian.component.scss']
})
export class AccordianComponent implements OnInit {
  qcForm: FormGroup;
  qcData = [
    {id: 1, name: "QC1", stages: [{id: 1, process: "pending"}, {id: 2, process: "pending"}]},
    {id: 2, name: "QC2", stages: [{id: 1, process: "pending"}, {id: 2, process: "pending"}]}
  ];

  constructor(private fb: FormBuilder) {
    this.qcForm = this.fb.group({
      qcs: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initializeForm();

    this.setupFormStatusListeners();
  }

  initializeForm() {
    const qcArray = this.qcForm.get('qcs') as FormArray;
    this.qcData.forEach(qc => {
      const stagesArray = qc.stages.map(stage => this.createStageGroup(stage));
      const qcGroup = this.fb.group({
        name: [qc.name, Validators.required],
        stages:  this.fb.array([
          this.initStage(true),  // First stage enabled
          this.initStage(false)  // Subsequent stages disabled initially
        ])
      });

      qcArray.push(qcGroup);
      this.addStatusChangeListeners(qcGroup);
    });
  }

  initStage(isEnabled: boolean): FormGroup {
    const stage = this.fb.group({
      status: ['', Validators.required],
      action: [{ value: '', disabled: true }],
      comments: [{ value: '', disabled: !isEnabled }]
    });

    if (!isEnabled) {
      stage.disable();
    }

    return stage;
  }

  createStageGroup(stage: any): FormGroup {
    return this.fb.group({
      process: [stage.process, Validators.required],
      status: [''],
      rejectReason: [''],
      furtherProcess: [''],
      comments: [''],
      action: ['']
    });
  }

  addStatusChangeListeners(qcGroup: FormGroup) {
    const stages = qcGroup.get('stages') as FormArray;
    stages.controls.forEach(stage => {
      stage.get('status')?.valueChanges.subscribe(status => {
        if (status === 'rejected') {
          stage.get('rejectReason')?.setValidators(Validators.required);
          stage.get('furtherProcess')?.setValidators(Validators.required);
        } else {
          stage.get('rejectReason')?.clearValidators();
          stage.get('furtherProcess')?.clearValidators();
        }
        stage.get('rejectReason')?.updateValueAndValidity();
        stage.get('furtherProcess')?.updateValueAndValidity();
      });
    });
  }

  getQcs(): FormArray {
    return this.qcForm.get('qcs') as FormArray;
  }

  getStages(qcIndex: number): FormArray {
    return this.getQcs().at(qcIndex).get('stages') as FormArray;
  }

   setupFormStatusListeners() {
    this.getQcs().controls.forEach((qcGroup, qcIndex) => {
      const stagesArray = this.getStages(qcIndex);
      
      stagesArray.controls.forEach((stageGroup, stageIndex) => {
        stageGroup.get('status').valueChanges.subscribe(status => {
          if (status === 'accepted' || status === 'rejected') {
            stageGroup.get('action').enable();
            stageGroup.get('comments').enable();
          }

          if (status === 'accepted' && stageGroup.valid && stageIndex < stagesArray.length - 1) {
            stagesArray.at(stageIndex + 1).enable();
          } else if (status === 'rejected' && stageGroup.valid && stageIndex < stagesArray.length - 1) {
            stagesArray.at(stageIndex + 1).enable();
          } else {
            if (stageIndex < stagesArray.length - 1) {
              stagesArray.at(stageIndex + 1).disable();
            }
          }
        });

        stageGroup.valueChanges.subscribe(() => {
          if (stageGroup.get('status').value === 'rejected' && stageIndex < stagesArray.length - 1) {
            if (stageGroup.valid) {
              stagesArray.at(stageIndex + 1).enable();
            } else {
              stagesArray.at(stageIndex + 1).disable();
            }
          }
        });
      });
    });
  }


  save() {
    console.log(this.qcForm);
    if (this.qcForm.valid) {
      const formValue = this.qcForm.value;
      console.log('Form Value:', formValue);
      // this.myService.saveFormDetails(formValue).subscribe(response => {
      //   console.log('Form saved successfully', response);
      // });
    } else {
      console.log('Form is not valid');
    }
  }
}
