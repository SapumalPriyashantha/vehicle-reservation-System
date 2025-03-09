import { NgModule } from '@angular/core';
import { MoneyPipe } from 'src/app/utility/pipes/money.pipe';



@NgModule({
  declarations: [MoneyPipe],
  exports:[MoneyPipe]
  
})
export class SharedModule { }
