import { Component, OnInit, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AppState } from 'src/app/app.state';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-czbrd-item',
  templateUrl: './czbrd-item.component.html',
  styleUrls: ['./czbrd-item.component.scss']
})
export class CzbrdItemComponent implements OnInit {

  @Input() doc;
  private overlayRef: OverlayRef;

  public tooltip: string;

  rdczDocs: any[] = [];
  vdkDocs: any[] = [];
  dpzDocs: any[] = [];
  hasImg = false;
  imgSrc: string;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    public state: AppState,
    private service: AppService
  ) { }

  ngOnInit(): void {
    // this.getRelations();
  }
  
  getRelations() {
    if (this.state.source === 'czbrd') {
      if (this.doc.ex_BIBCARKOD && this.doc.ex_BIBCARKOD.length > 0) {
        this.service.getRelations([this.doc.ex_BIBCARKOD], [this.doc.ex_BIBSIGNATURA]).subscribe((resp: any) => {
          this.dpzDocs = resp.dpz.docs;
          this.rdczDocs = resp.rdcz.docs;
          this.vdkDocs = resp.vdk.docs;
        });
      }
    }
  }

  onImageFound(imgSrc: string) {
    this.imgSrc = imgSrc;
    this.hasImg = true;
  }

  viewPh(relative: any, template: TemplateRef<any>) {
    if (this.doc.mer_DRUHZASAHU.length > 1) {
      const arr: Array<string> = this.doc.mer_DRUHZASAHU;
      this.tooltip = arr.join('<br/>');
      this.closeInfoOverlay();
      setTimeout(() => {
        this.openInfoOverlay(relative, template);
      }, 200);
    }
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

}
