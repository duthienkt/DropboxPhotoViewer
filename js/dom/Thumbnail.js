import '../../style/thumbnail.css';
import Core, {$, _} from "../app/Core";
import OOP from "absol/src/HTML5/OOP";


function Thumbnail() {
    this.$img = $('.dpv-thumbnail-img', this);
    this.$filename = $('.dpv-thumbnail-filename', this);
    this.$filenameText = this.$filename.firstChild;
    OOP.drillProperty(this, this.$img, 'imgSrc', 'src');
    OOP.drillProperty(this, this.$filenameText, 'filename', 'data');
}

Thumbnail.tag = 'Thumbnail'.toLowerCase();

Thumbnail.render = function () {
    return _({
        class: 'dpv-thumbnail',
        child: [
            {
                class: 'dpv-thumbnail-img-ctn',
                child: {
                    tag: 'img',
                    class: 'dpv-thumbnail-img'
                }
            },
            {
                class: 'dpv-thumbnail-filename',
                child: { text: '' }
            }
        ]
    })
};

Thumbnail.property = {};

Core.install(Thumbnail);

export default Thumbnail;