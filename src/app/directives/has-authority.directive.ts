import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[hasAuthority]',
  standalone: false

})
export class HasAuthorityDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
  ) { }

  user: any = {};
  referenceRole: string[] = [];

  @Input()
  set hasRole(value: string | string[]) {

    this.user = JSON.parse(localStorage.getItem('tcmuser') ?? '{}');

    if (Array.isArray(value)) {
      value.forEach((role) => {
        this.referenceRole.push(role);
      })
    } else {
      this.referenceRole.push(value);
    }

    this.updateView();

  }

  private updateView(): void {
    let hasRole = false;

    this.referenceRole.forEach((role) => {
      if (this.user.role == role) {
        hasRole = true;
      }
    });

    this.viewContainerRef.clear();

    if (hasRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
