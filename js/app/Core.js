import install from "absol-acomp/js/dom/install";
import Dom from "absol/src/HTML5/Dom";

var Core = new Dom({});
install(Core);
export default Core;
export var _ = Core._;
export var $ = Core.$;
export var $$ = Core.$$;