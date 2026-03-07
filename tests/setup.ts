import { GlobalWindow } from "happy-dom";

const window = new GlobalWindow();
(global as unknown as { window: unknown }).window = window;
(global as unknown as { document: unknown }).document = window.document;
(global as unknown as { navigator: unknown }).navigator = window.navigator;
(global as unknown as { location: unknown }).location = window.location;
(global as unknown as { HTMLAnchorElement: unknown }).HTMLAnchorElement = window.HTMLAnchorElement;
(global as unknown as { HTMLElement: unknown }).HTMLElement = window.HTMLElement;
(global as unknown as { Node: unknown }).Node = window.Node;
(global as unknown as { localStorage: unknown }).localStorage = window.localStorage;
(global as unknown as { sessionStorage: unknown }).sessionStorage = window.sessionStorage;

window.document.body.innerHTML = '<div id="root"></div>';
