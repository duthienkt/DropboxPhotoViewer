import '../../style/folderviewer.css';
import Fragment from "absol/src/AppPattern/Fragment";
import OOP from "absol/src/HTML5/OOP";
import {Dropbox} from "dropbox/src/dropbox";
import {$, _} from "./Core";
import Thumbnail from "../dom/Thumbnail";
import SnackBar from "absol-acomp/js/Snackbar";
import {fileSize2Text} from "../utils";
import R from "./R";
import XRequest from "absol-x-request/src/browser/XRequest";
import config from "./config";

var SUPPORT_EXT = ["3g2", "3ga", "3gp", "7z", "aa", "aac", "ac", "accdb", "accdt", "ace", "adn", "ai", "aif", "aifc",
    "aiff", "ait", "amr", "ani", "apk", "app", "applescript", "asax", "asc", "ascx", "asf", "ash", "ashx", "asm",
    "asmx", "asp", "aspx", "asx", "au", "aup", "avi", "axd", "aze", "bak", "bash", "bat", "bin", "blank", "bmp",
    "bowerrc", "bpg", "browser", "bz2", "bzempty", "c", "cab", "cad", "caf", "cal", "cd", "cdda", "cer", "cfg", "cfm",
    "cfml", "cgi", "chm", "class", "cmd", "code-workspace", "codekit", "coffee", "coffeelintignore", "com", "compile",
    "conf", "config", "cpp", "cptx", "cr2", "crdownload", "crt", "crypt", "cs", "csh", "cson", "csproj", "css", "csv",
    "cue", "cur", "dart", "dat", "data", "db", "dbf", "deb", "default", "dgn", "dist", "diz", "dll", "dmg", "dng",
    "doc", "docb", "docm", "docx", "dot", "dotm", "dotx", "download", "dpj", "ds_store", "dsn", "dtd", "dwg", "dxf",
    "editorconfig", "el", "elf", "eml", "enc", "eot", "eps", "epub", "eslintignore", "exe", "f4v", "fax", "fb2", "fla",
    "flac", "flv", "fnt", "folder", "fon", "gadget", "gdp", "gem", "gif", "gitattributes", "gitignore", "go", "gpg",
    "gpl", "gradle", "gz", "h", "handlebars", "hbs", "heic", "hlp", "hs", "hsl", "htm", "html", "ibooks", "icns", "ico",
    "ics", "idx", "iff", "ifo", "image", "img", "iml", "in", "inc", "indd", "inf", "info", "ini", "inv", "iso", "j2",
    "jar", "java", "jpe", "jpeg", "jpg", "js", "json", "jsp", "jsx", "key", "kf8", "kmk", "ksh", "kt", "kts", "kup",
    "less", "lex", "licx", "lisp", "lit", "lnk", "lock", "log", "lua", "m", "m2v", "m3u", "m3u8", "m4", "m4a", "m4r",
    "m4v", "map", "master", "mc", "md", "mdb", "mdf", "me", "mi", "mid", "midi", "mk", "mkv", "mm", "mng", "mo", "mobi",
    "mod", "mov", "mp2", "mp3", "mp4", "mpa", "mpd", "mpe", "mpeg", "mpg", "mpga", "mpp", "mpt", "msg", "msi", "msu",
    "nef", "nes", "nfo", "nix", "npmignore", "ocx", "odb", "ods", "odt", "ogg", "ogv", "ost", "otf", "ott", "ova", "ovf",
    "p12", "p7b", "pages", "part", "pcd", "pdb", "pdf", "pem", "pfx", "pgp", "ph", "phar", "php", "pid", "pkg", "pl",
    "plist", "pm", "png", "po", "pom", "pot", "potx", "pps", "ppsx", "ppt", "pptm", "pptx", "prop", "ps", "ps1", "psd",
    "psp", "pst", "pub", "py", "pyc", "qt", "ra", "ram", "rar", "raw", "rb", "rdf", "rdl", "reg", "resx", "retry", "rm",
    "rom", "rpm", "rpt", "rsa", "rss", "rst", "rtf", "ru", "rub", "sass", "scss", "sdf", "sed", "sh", "sit", "sitemap",
    "skin", "sldm", "sldx", "sln", "sol", "sphinx", "sql", "sqlite", "step", "stl", "svg", "swd", "swf", "swift", "swp",
    "sys", "tar", "tax", "tcsh", "tex", "tfignore", "tga", "tgz", "tif", "tiff", "tmp", "tmx", "torrent", "tpl", "ts",
    "tsv", "ttf", "twig", "txt", "udf", "vb", "vbproj", "vbs", "vcd", "vcf", "vcs", "vdi", "vdx", "vmdk", "vob", "vox",
    "vscodeignore", "vsd", "vss", "vst", "vsx", "vtx", "war", "wav", "wbk", "webinfo", "webm", "webp", "wma", "wmf",
    "wmv", "woff", "woff2", "wps", "wsf", "xaml", "xcf", "xfl", "xlm", "xls", "xlsm", "xlsx", "xlt", "xltm", "xltx",
    "xml", "xpi", "xps", "xrb", "xsd", "xsl", "xspf", "xz", "yaml", "yml", "z", "zip", "zsh"]
    .reduce(function (ac, cr) {
        ac[cr] = true;
        return ac;
    }, {});

/***
 * @extends Fragment
 * @param {Dropbox} dropbox
 * @constructor
 */
function FolderViewer(dropbox) {
    Fragment.call(this);
    this.dropbox = dropbox;
    this.thumbnailCache = {};
    this.rootEntry = null;
}

OOP.mixClass(FolderViewer, Fragment);


FolderViewer.prototype.onStart = function () {
    this.fileExplorer = this.getContext(R.FILE_EXPLORER);
};

FolderViewer.prototype.createView = function () {
    this.$view = _({
        tag: 'dropzone',
        class: 'dpv-folder-viewer',
        child: [
            {
                class: 'dpv-folder-viewer-header'
            },
            {
                class: 'dpv-folder-viewer-body'
            },
            {
                class: 'dpv-folder-viewer-drop-modal',
                props: {}
            },
        ],
        on: {
            filedrop: this.ev_fileDrop.bind(this)
        }
    });
    this.$body = $('.dpv-folder-viewer-body', this.$view);
};

FolderViewer.prototype.viewFolder = function (rootEntry) {
    var thisV = this;
    this.$body.clearChild();
    this.rootEntry = rootEntry;
    rootEntry.child.forEach(function (childEntry) {
        var thumbnailElt = _({
            tag: 'thumbnail',
            props: {
                imgSrc: 'https://absol.cf/exticons/vivid/folder.svg',
                filename: childEntry.name
            }
        });
        if (childEntry['.tag'] === 'folder') {
            thumbnailElt.imgSrc = 'https://absol.cf/exticons/vivid/folder.svg';
        }
        else {
            var ext = (childEntry.name.split('.').pop() || '').toLowerCase();
            if (!SUPPORT_EXT[ext]) {
                ext = 'default';
            }
            thumbnailElt.imgSrc = 'https://absol.cf/exticons/vivid/' + ext + '.svg';
            if (['jpg', 'png', "jpeg"].indexOf(ext) >= 0) {
                if (!thisV.thumbnailCache[childEntry.path]) {
                    thisV.thumbnailCache[childEntry.path] = thisV.dropbox.filesGetThumbnail({
                        path: childEntry.id,
                        format: 'jpeg',
                        size: 'w64h64',
                        mode: 'strict'
                    }).then(function (res) {
                        var result = res.result;
                        if (result) {
                            result.blobUrl = URL.createObjectURL(result.fileBlob);
                            return result;
                        }
                        return null;
                    });
                }
                thisV.thumbnailCache[childEntry.path].then(function (result) {
                    if (result)
                        thumbnailElt.imgSrc = result.blobUrl;
                })
            }
        }
        var wrapperElt = _({
            class: 'dpv-thumbnail-wrapper',
            child: thumbnailElt
        });
        thisV.$body.addChild(wrapperElt);
    });
};

FolderViewer.prototype.ev_fileDrop = function (event) {
    var thisV = this;
    event.files.reduce(function (sync, file) {
        if (file.size > 150000000){
            SnackBar.show("Can not upload " + file.name + ' '+ fileSize2Text(file.size) + ' - TOO BIG')
            return  sync;
        }
        return sync.then(function () {
            SnackBar.show("Upload " + file.name + ' ' + fileSize2Text(file.size))

            return new Promise(function (resolve) {
                var fileReader = new FileReader();
                fileReader.onloadend = function () {
                    new XRequest({
                        url: 'https://content.dropboxapi.com/2/files/upload',
                        method: "POST"
                    })
                        .header({
                            Authorization: 'Bearer ' + config.accessToken,
                            'Dropbox-API-Arg': JSON.stringify({
                                path: '/' + thisV.rootEntry.path.concat(file.name).join('/'),
                                mode: 'add',
                                autorename: false,
                                mute: false,
                                strict_conflict: false
                            })
                        })
                        .on('uploadprogress', function (event) {
                            SnackBar.show("Upload " + file.name + ' ' + Math.floor(event.loaded * 100 / event.total) + '%')
                        })
                        .binary(fileReader.result)
                        .exec().then(resolve);
                }
                fileReader.readAsArrayBuffer(file);
            });
        })
    }, Promise.resolve())
        .then(function () {
            thisV.fileExplorer.reloadTree().then(function () {
                thisV.fileExplorer.viewFolder(thisV.rootEntry.path);
            })
        });
}


export default FolderViewer;