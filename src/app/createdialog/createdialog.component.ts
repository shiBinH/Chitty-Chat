// import {Component, Inject} from '@angular/core';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// export interface DialogData {
//   animal: string;
//   name: string;
// }

// /**
//  * @title Dialog Overview
//  */
// @Component({
//   selector: 'app-createdialog',
//   templateUrl: 'createdialog.html',
//   styleUrls: ['createdialog.css'],
// })
// export class CreateDialogComponent {

//   animal: string;
//   name: string;

//   constructor(public dialog: MatDialog) {}

//   openDialog(): void {
//     const dialogRef = this.dialog.open(CreateDialogComponent, {
//       width: '5000px',
//       data: {name: this.name, animal: this.animal}
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//       this.animal = result;
//     });
//   }

// }

// @Component({
//   // tslint:disable-next-line: component-selector
//   selector: 'createdialog-example',
//   templateUrl: 'dialog-overview-example-dialog.html',
// })
// // tslint:disable-next-line: component-class-suffix
// export class CreatedialogExample {

//   constructor(
//     public dialogRef: MatDialogRef<CreatedialogExample>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
