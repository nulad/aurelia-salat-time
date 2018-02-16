export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'praytime'], name: 'praytime',      moduleId: 'praytime',      nav: true, title: 'Prayer Time' }
    ]);

    this.router = router;
  }
}
