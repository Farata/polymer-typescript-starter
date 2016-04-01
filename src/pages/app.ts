const APP_PREFIX: string = 'my';

Polymer({
  is: 'my-app',

  properties: {
    routeData: {
      type: Object,
      observer: 'onRouteChange'
    }
  },

  onRouteChange(data) {
    this.activate(data.page || 'home');
    console.log(JSON.stringify(data, null, 2));
  },

  activate(name: string) {
    this.importHref(this.buildUrl(name),
        () => this.appendPage(name),
        console.error.bind(console));
  },

  appendPage(name: string): void {
    let page = document.createElement(`${APP_PREFIX}-${name}`);
    Polymer.dom(this.$.pages).appendChild(page);
    this.$.pages.selected = page.localName;
  },

  buildUrl(name: string): string {
    return this.resolveUrl(`${name}/${name}.html`);
  },

  cleanupInactivePages() {
    this.$.pages.items
      .filter(item => item !== this.$.pages.selectedItem)
      .forEach(item => Polymer.dom(this.$.pages).removeChild(item));
  }
});
