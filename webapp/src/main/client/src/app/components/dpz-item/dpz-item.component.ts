import { Component, OnInit, Input } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-dpz-item',
  templateUrl: './dpz-item.component.html',
  styleUrls: ['./dpz-item.component.scss']
})
export class DpzItemComponent implements OnInit {

  @Input() doc;

  vdkDocs: any[] = [];
  czbrdDocs: any[] = [];
  rdczDocs: any[] = [];

  constructor(
    public state: AppState,
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.getRelations();
  }

  getRelations() {
    if (this.state.source === 'dpz') {
      if (this.doc.signatura && this.doc.signatura.length > 0) {
        this.service.getRelations([], this.doc.signatura).subscribe((resp: any) => {
          this.rdczDocs = resp.rdcz.docs;
          this.czbrdDocs = resp.czbrd.docs;
          this.vdkDocs = resp.vdk.docs;
        });
      }
    }
  }

  setThumbUrl(val) {
    return "http://195.113.132.51:8080/razitka/download?entityId=Exemplar&propertyId=BinaryProperty:Exemplar.obrazek&primaryKey=" + val + "&maxSize=-1&timestamp=1593422827061";
  }

}
