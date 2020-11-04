import '../../style/app.css';
import 'absol-form/css/formeditor.css';
import OOP from "absol/src/HTML5/OOP";
import {$, _} from "./Core";
import BaseEditor from "absol-form/js/core/BaseEditor";
import {randomIdent} from "absol/src/String/stringGenerate";
import Draggable from "absol-acomp/js/Draggable";
import FormEditor from "absol-form/js/editor/FormEditor";
import Dom from "absol/src/HTML5/Dom";
import Dropbox from "dropbox/src/dropbox";
import DropboxFileExplorer from "./DropBoxFileExplorer";


/***
 * @extends BaseEditor
 * @param {{accessToken:string}} option
 * @constructor
 */
function NikMi500px(option) {
    BaseEditor.call(this);
    this.option = option;
    this.prefix = randomIdent(12);
    this.dropbox = new Dropbox({ accessToken: this.option.accessToken, fetch: window.fetch.bind(window)});
    this.fileExplorer = new DropboxFileExplorer(this.dropbox);
}

OOP.mixClass(NikMi500px, BaseEditor);


NikMi500px.prototype.config = {
    leftSiteWidthPercent: 19
};
NikMi500px.prototype.CONFIG_STORE_KEY = "NikMi500px_Config";

NikMi500px.prototype.onStart = function () {
    this.toggleToolTab('explorer');
};

NikMi500px.prototype.createView = function () {
    this.$view = _({
        class: ['as-form-editor', 'dpv-app'],
        attr: {
            tabindex: '1'
        },
        child: [
            {
                class: 'as-form-editor-left-tab-bar',
                child: [
                    {
                        tag: 'button',
                        id: this.prefix + 'button-tab-explorer',
                        child: 'span.mdi.mdi-dropbox',
                        attr: {
                            title: 'Explorer'
                        },
                        on: {
                            click: this.toggleToolTab.bind(this, 'explorer')
                        }
                    }
                ]
            },
            {
                class: 'as-form-editor-left-site-container',
                style: {
                    width: 'calc(' + this.config.leftSiteWidthPercent + "% - 3em)"
                },
                child: {
                    tag: 'frameview',
                    class: ['xp-tiny', 'as-form-editor-left-site'],
                    child: [
                        {
                            tag: 'tabframe',
                            class: ['as-form-left-tool-site-tab'],
                            attr: {
                                name: 'Explorer',
                                id: this.prefix + 'tab-explorer',
                            },
                            child: [
                                {
                                    class: 'as-form-tool-site-header',
                                    child: {
                                        tag: 'span',
                                        child: { text: 'EXPLORER' }
                                    }
                                },
                                this.fileExplorer.getView()
                            ]
                        }
                    ]
                }
            },
            {
                class: 'as-form-editor-empty-space',
                style: {
                    left: 'calc(' + this.config.leftSiteWidthPercent + "%)"
                },
                child: {
                    tag: 'frame-ico',
                    style: {
                        width: '10em',
                        height: '10em',
                        '-webkit-filter': 'grayscale(100%)',
                        filter: 'grayscale(100%)',
                        opacity: '0.2',
                        position: 'absolute',
                        right: '1em',
                        bottom: '1em'
                    }
                }
            },
            {
                class: 'as-form-editor-editor-space-container',
                style: {
                    left: 'calc(' + this.config.leftSiteWidthPercent + "%)",
                    visibility: 'hidden'
                },
                child: {
                    tag: 'tabview',
                    class: 'as-form-editor-main-tabview'
                }
            },

            {
                class: ['as-form-editor-resizer', 'vertical', 'left-site'],
                style: {
                    left: 'calc(' + this.config.leftSiteWidthPercent + "% - 0.2em)"
                }
            }
        ],
        on: {
            keydown: this.ev_cmdKeyDown.bind(this)
        }
    });

    this.tabList = {
        'explorer':{
            $tab: $('#'+this.prefix + 'tab-explorer', this.$view),
            fragment: this.fileExplorer
        }
    }

    this.$leftTabbar = $('.as-form-editor-left-tab-bar', this.$view);

    this.$mainTabview = $('.as-form-editor-main-tabview', this.$view);
    // this.$mainTabview.appendChild(this.$quickToolBar);

    this.$exploreTabFrame = $('tabframe#' + this.prefix + 'tab-explorer', this.$view);
    this.$componentTabFrame = $('tabframe#' + this.prefix + 'tab-component', this.$view);
    this.$outlineTabFrame = $('tabframe#' + this.prefix + 'tab-outline', this.$view);

    this.$attachhook = _('attachook').addTo(this.$view).on('error', function () {
        Dom.addToResizeSystem(this);
        this.updateSize = this.updateSize || self.ev_resize.bind(this);
    });
    this.$leftSiteCtn = $('.as-form-editor-left-site-container', this.$view);
    this.$rightSiteCtn = $('.as-form-editor-right-site-container', this.$view);
    this.$editorSpaceCtn = $('.as-form-editor-editor-space-container', this.$view);
    this.$emptySpace = $('.as-form-editor-empty-space', this.$view);

    this.$leftSiteResizer = Draggable($('.as-form-editor-resizer.vertical.left-site', this.$view))
        .on('predrag', this.ev_preDragLeftResizer.bind(this))
        .on('enddrag', this.ev_endDragLeftResizer.bind(this))
        .on('drag', this.ev_dragLeftResizer.bind(this));
};

NikMi500px.prototype.ev_preDragLeftResizer = FormEditor.prototype.ev_preDragLeftResizer;
NikMi500px.prototype.ev_endDragLeftResizer = FormEditor.prototype.ev_endDragLeftResizer;
NikMi500px.prototype.ev_dragLeftResizer = FormEditor.prototype.ev_dragLeftResizer;

NikMi500px.prototype.setLeftSiteWidthPercent = FormEditor.prototype.setLeftSiteWidthPercent;

NikMi500px.prototype.toggleToolTab = function (name){
    if (name == this._lastToolTabName) return ;
    if (this._lastToolTabName){
        this.tabList[this._lastToolTabName].fragment.pause();
    }
    console.log()
    this._lastToolTabName = name;
    console.log(this.tabList)
    this.tabList[this._lastToolTabName].$tab.requestActive();
    this.tabList[this._lastToolTabName].fragment.start();
};

export default NikMi500px;