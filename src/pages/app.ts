const APP_PREFIX: string = 'my';
const DEFAULT_PAGE: string = 'home';

Polymer({
  is: 'my-app',

  properties: {
    routeData: {
      type: Object,
      observer: 'onRouteChange'
    }
  },

  onRouteChange(data: {page: string}) {
    if ('page' in data) {
      this.activate(data.page || DEFAULT_PAGE);
    }
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
