import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-rdcz-item',
  templateUrl: './rdcz-item.component.html',
  styleUrls: ['./rdcz-item.component.scss']
})
export class RdczItemComponent implements OnInit {

  @Input() doc;
  hasImg = false;
  imgSrc: string;
  imgWidth = 100;
  @Output() imageFound = new EventEmitter<string>();
  showingDetail: boolean = false;

  digObjects: any[] = [];

  vdkDocs: any[] = [];
  czbrdDocs: any[] = [];
  dpzDocs: any[] = [];

  constructor(
    public state: AppState,
    private service: AppService
  ) { }

  ngOnInit(): void {
    this.getDigObjects();
    // this.getRelations();
    this.setShowDetail();
  }

  getRelations() {
    if (this.state.source === 'rdcz') {
      if (this.doc.signatura && this.doc.signatura.length > 0) {
        this.service.getRelations([this.doc.carkod], [this.doc.signatura]).subscribe((resp: any) => {
          this.dpzDocs = resp.dpz.docs;
          this.czbrdDocs = resp.czbrd.docs;
          this.vdkDocs = resp.vdk.docs;
        });
      }
    }
  }

  addDigObjUrl(url) {
    if (url) {
      for (const i in this.digObjects) {
        if (this.digObjects[i].url === url.trim()) {
          return;
        }
      }
      this.digObjects.push({ url: url.trim() });
    }
  }

  getDigObjects() {
    if (this.state.sources.rdcz) {
      if (this.doc.carkod && this.doc.carkod.length > 0) {
        this.service.getDigObjects(this.doc.id).subscribe((resp: any) => {

          resp.docs.forEach(doc => {
            const dourl = doc.urldigknihovny + '/search/handle/uuid:' + doc.uuid;
            this.addDigObjUrl(dourl);

            if (this.doc.financovano.toLowerCase() === 'iop' || this.doc.financovano.toLowerCase() === 'iop-ndku') {
              if (doc.digknihovna === 'ABA001-DK' || doc.digknihovna === 'ABA000-DK' || doc.vlastnik === 'ABA001') {
                this.addDigObjUrl('http://kramerius4.nkp.cz/search/handle/uuid:' + doc.uuid);
                this.addDigObjUrl('http://www.digitalniknihovna.cz/mzk/uuid/uuid:' + doc.uuid);
              } else if (doc.digknihovna === 'BOA000-DK' || doc.vlastnik === 'BOA001') {
                this.addDigObjUrl('http://kramerius4.nkp.cz/search/handle/uuid:' + doc.uuid);
                this.addDigObjUrl('http://www.digitalniknihovna.cz/mzk/uuid/uuid:' + doc.uuid);
              }
            }
          });


          if (resp.docs.length > 0) {
            this.hasImg = true;
            this.imgSrc = resp.docs[0].urldigknihovny +
              '/search/img?stream=IMG_THUMB&action=SCALE&scaledWidth=' +
              this.imgWidth + '&uuid=uuid:' + resp.docs[0].uuid;
            this.imageFound.emit(this.imgSrc);
          }
        });
      }
    }
  }

  showDetail() {
    this.showingDetail = !this.showingDetail;
  }

  setShowDetail() {
    if (this.state.source !== 'rdcz') {
      this.showingDetail = true;
    }
  }

}
