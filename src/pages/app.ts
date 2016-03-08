declare var Polymer: any;

const APP_PREFIX: string = 'my';

Polymer({
  is: 'my-app',

  ready() {
    page('/',        this.activate('home'));
    page('/profile', this.activate('profile'));
    page({hashbang: true});
  },

  activate(name: string): PageJS.Callback {
    return () => {
      this.importHref(this.buildUrl(name),
        () => this.appendPage(name),
        console.error.bind(console));
    };
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
