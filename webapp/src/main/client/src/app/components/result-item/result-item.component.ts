import { Component, OnInit, Input, OnDestroy, ViewContainerRef, TemplateRef } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { AppConfiguration } from 'src/app/app-configuration';
import { AppService } from 'src/app/app.service';
import { AppState } from 'src/app/app.state';
import { TemplatePortal } from '@angular/cdk/portal';
import { Exemplar, ExemplarZdroj } from 'src/app/shared/exemplar';
import { SolrResponse } from 'src/app/shared/solr-response';

@Component({
  selector: 'app-result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss']
})

export class ResultItemComponent implements OnInit, OnDestroy {
  private overlayRef: OverlayRef;
  @Input() doc;
  @Input() idx;

  rdczDocs: any[] = [];
  czbrdDocs: any[] = [];
  dpzDocs: any[] = [];

  displayedColumns = ['zdroj', 'signatura', 'status', 'dilciKnih', 'rocnik_svazek', 'cislo', 'rok'];

  exemplars: Exemplar[];
  offers: string[];
  demands: string[];

  activeStatus: string = null;
  activeZdroj: string = null;
  isInCart: boolean;

  docInOffer: boolean;
  hasImg = false;
  imgSrc: string;

  public tooltip: {
    field: string,
    text: string
  } = {
      field: '',
      text: ''
    };

  constructor(
    public dialog: MatDialog,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private config: AppConfiguration,
    private service: AppService,
    public state: AppState
  ) { }

  ngOnInit() {
    this.setExemplars();
    this.docInOffer = this.isInOffer();
    // this.getRelations();
  }

  getRelations() {
    if (this.state.sources.dpz) {
      if (this.doc.signatura && this.doc.signatura.length > 0) {
        this.service.getRelations(this.doc.carkod, this.doc.signatura).subscribe((resp: any) => {
          this.dpzDocs = resp.dpz.docs;
          this.czbrdDocs = resp.czbrd.docs;
          this.rdczDocs = resp.rdcz.docs;
        });
      }
    }
  }

  onImageFound(imgSrc: string) {
    this.imgSrc = imgSrc;
    this.hasImg = true;
  }

  getCZBRD() {
    if (this.state.sources.czbrd) {
      if (this.doc.carkod && this.doc.carkod.length > 0) {
        this.service.getCZBRD(this.doc.carkod).subscribe((resp: SolrResponse) => {
          this.czbrdDocs = resp.response.docs;
        });
      }
    }
  }

  setExemplars() {
    this.exemplars = [];
    if (this.doc.ex) {
      const exs: ExemplarZdroj[] = this.doc.ex;
      exs.forEach(exZdroj => {
        if (exZdroj.ex) {
          exZdroj.ex.forEach(ex => {
            ex.zdroj = exZdroj.zdroj;
            if (exZdroj.zdroj === 'UKF') {
              ex.knihovna = 'NKP';
            } else {
              ex.knihovna = exZdroj.zdroj;
            }
            if (ex.isNKF) {
              ex.zdroj = 'NKF';
            }
            ex.id = exZdroj.id;
            ex.isInOffer = this.isInOffer(ex);
            ex.isDemand = this.hasDemand(ex);
            ex.belongUser = this.belongUser(ex);

            this.exemplars.push(ex);
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.closePop();
  }

  hasDifferences(field: string): boolean {
    return false;
    // const arr: Array<any> = this.doc[field];
    // if (!arr) {
    //   return false;
    // }
    // if (!arr[0]) {
    //   return false;
    // }
    // return !arr.every(v => {
    //   if (v instanceof Array) {
    //     return JSON.stringify(v) === JSON.stringify(arr[0]);
    //   } else {
    //     return v === arr[0];
    //   }
    // });
  }

  openPop(field: string, relative: any, template: TemplateRef<any>) {
    const arr: Array<string> = this.doc[field];
    this.tooltip = {
      field,
      text: arr.join('<br/>')
    };
    this.closeInfoOverlay();
    setTimeout(() => {
      this.openInfoOverlay(relative, template);
    }, 200);
  }

  closePop() {
    this.closeInfoOverlay();
  }

  openInfoOverlay(relative: any, template: TemplateRef<any>) {
    this.closeInfoOverlay();

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().flexibleConnectedTo(relative._elementRef).withPositions([{
        overlayX: 'end',
        overlayY: 'top',
        originX: 'center',
        originY: 'bottom'
      }]).withPush().withViewportMargin(30).withDefaultOffsetX(37).withDefaultOffsetY(20),
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: true,
      backdropClass: 'popover-backdrop'
    });
    this.overlayRef.backdropClick().subscribe(() => this.closeInfoOverlay());

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  closeInfoOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  openLink(id?: string) {
    if (id) {
      window.open('/api/original?id=' + id);
    } else {
      window.open('/api/original?id=' + this.doc.id[0]);
    }
  }

  addToOffer(ex?: Exemplar) {
  }

  addToDemands(ex?: Exemplar) {
  }

  removeFromDemands(ex?: Exemplar) {
  }

  csv() {
  }

  hasIcon(zdroj: string) {
    // return this.config.standardSources.includes(zdroj);
    return false;
  }

  getOfferUser(id: string): string {
    let code = id;
    return code;
  }

  belongUser(ex: Exemplar): boolean {

    return false;
  }

  userHasDoc(): boolean {
    return false;
  }

  isInOffer(ex?: Exemplar): boolean {

    return false;
  }

  hasDemand(ex?: Exemplar): boolean {
    return false;

  }

  toggleStatus(status: string) {
    if (this.activeStatus !== null) {
      this.activeStatus = null;
    } else {
      this.activeStatus = status;
    }
  }

  toggleZdroj(zdroj: string) {
    if (this.activeZdroj !== null) {
      this.activeZdroj = null;
    } else {
      this.activeZdroj = zdroj;
    }
  }

  isRowHidden(row): boolean {
    return (this.activeStatus !== null && row.status !== this.activeStatus) ||
      (this.activeZdroj !== null && row.zdroj !== this.activeZdroj);
  }
}