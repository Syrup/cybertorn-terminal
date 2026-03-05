import { GlobalWindow } from "happy-dom";

const window = new GlobalWindow();
(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = window.navigator;
(global as any).location = window.location;
(global as any).HTMLAnchorElement = window.HTMLAnchorElement;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Node = window.Node;
(global as any).localStorage = window.localStorage;
(global as any).sessionStorage = window.sessionStorage;

// Set up a basic document structure
window.document.body.innerHTML = '<div id="root"></div>';
