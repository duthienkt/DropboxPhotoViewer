import NikMi500px from "./NikMi500px";
import config from "./config";

var app = new NikMi500px({ accessToken: config.accessToken });
app.getView().addTo(document.body);
app.start();

