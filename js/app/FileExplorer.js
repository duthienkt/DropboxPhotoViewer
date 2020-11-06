import OOP from "absol/src/HTML5/OOP";
import Fragment from "absol/src/AppPattern/Fragment";
import {$, _} from "./Core";
import Dropbox from "dropbox/src/dropbox";
import ExpTree from "absol-acomp/js/ExpTree";
import ContextCaptor from "absol-acomp/js/ContextMenu";
import R from "./R";

ContextCaptor.auto();

/***
 * @extends Fragment
 * @constructor
 * @param {Dropbox} dropbox
 */
function FileExplorer(dropbox) {
    Fragment.call(this);
    this.dropbox = dropbox;
    this.fileList = null;
}


OOP.mixClass(FileExplorer, Fragment)

FileExplorer.prototype.createView = function () {
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
            },
            on:{
                press: this.viewFolder.bind(this, [])
            }
        }
    });
    this.$root = $('exptree', this.$view);
};

FileExplorer.prototype.onStart = function () {
    this.folderViewer = this.getContext(R.FOLDER_VIEWER);
    this.reloadTree().then(this.viewFolder.bind(this, []));
};

FileExplorer.prototype.reloadTree = function () {
    var thisF = this;
    return this.dropbox.filesListFolder({ path: '', recursive: true }).then(function (res) {
        thisF.$root.clearChild();
        thisF.$root.dropboxData = {
            name: 'NikMi500px',
            path_display: '',
            child: [],
            path: []
        };

        res.result.entries.forEach(function (entry) {
            var cPath = entry.path_display.split('/');
            cPath.shift();
            var parent = thisF.$root.accessByPath(cPath.slice(0, cPath.length - 1));
            if (entry[".tag"] === "folder") {
                /***
                 * @type {ExpTree}
                 */
                var elt = _({
                    tag: 'exptree',
                    props: {
                        icon: {
                            tag: 'img',
                            props: {
                                src: 'https://absol.cf/exticons/vivid/folder.svg'
                            }
                        },
                        name: entry.name,
                        dropboxData: Object.assign({
                            child: [],
                            path: cPath
                        }, entry)
                    },
                    on: {
                        press: function (event) {
                            thisF.viewFolder(cPath);
                        }
                    }
                });

                var nodeElt = elt.getNode();
                nodeElt.defineEvent('contextmenu');

                parent.addChild(elt);
                if (parent.status !== 'open') parent.status = 'open';
                parent.dropboxData.child.push(elt.dropboxData);
            }
            else if (entry[".tag"] === 'file') {
                parent.dropboxData.child.push(Object.assign({ path: cPath }, entry));
            }
        });
    });
};


FileExplorer.prototype.viewFolder = function (path) {
    var node = this.$root.accessByPath(path);
    var dropboxData = node.dropboxData;
    this.folderViewer.viewFolder(dropboxData);
};


export default FileExplorer;
