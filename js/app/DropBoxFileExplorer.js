import OOP from "absol/src/HTML5/OOP";
import Fragment from "absol/src/AppPattern/Fragment";
import {$, _} from "./Core";
import Dropbox from "dropbox/src/dropbox";
import ExpTree from "absol-acomp/js/ExpTree";

/***
 * @extends Fragment
 * @constructor
 * @param {Dropbox} dropbox
 */
function DropboxFileExplorer(dropbox) {
    Fragment.call(this);
    this.dropbox = dropbox;

}

OOP.mixClass(DropboxFileExplorer, Fragment)

DropboxFileExplorer.prototype.createView = function () {
    this.$view = _({
        class: 'dpv-file-explore',
        child: {
            tag: 'exptree',
            props: {
                name: "NikMi500px",
                icon: {
                    tag: 'img',
                    props: {
                        src: './assets/app_icon.svg'
                    }
                },
                status: 'open'
            }
        }
    });
    this.$root = $('exptree', this.$view);
};

DropboxFileExplorer.prototype.onStart = function () {
    var thisF = this;
    this.dropbox.filesListFolder({ path: '' }).then(function (res) {
        thisF.$root.clearChild();
        res.result.entries.forEach(function (entry) {
            if (entry[".tag"] === "folder") {

            }
        });
    });
};

export default DropboxFileExplorer;
