import { Component, OnInit } from '@angular/core';
declare const SwaggerUIBundle: any;
@Component({
  selector: 'app-swagger-ui',
  templateUrl: './swagger-ui.component.html',
  styleUrls: ['./swagger-ui.component.css']
})
export class SwaggerUIComponent {
  ngOnInit() {
    const ui = SwaggerUIBundle({
      url: `${window.location.origin}/swagger.json`,
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: 'BaseLayout',
      deepLinking: true
    });
  }
}
