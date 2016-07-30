# Pip.WebUI.Layouts User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
- [pip-main directive](#main)
- [pip-main-body directive](#main_body)
- [pip-simple directive](#simple)
- [pip-document directive](#document)
- [pip-card directive](#card)
- [pip-tiles directive](#tiles)
- [pip-dialog directive](#dialog)
- [pipSplit service](#split_service)
- [Questions and bugs](#issues)


## <a name="install"></a> Installing

Add dependency to **pip-webui** into your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
```

Alternatively you can install **pip-webui** manually using **bower**:
```bash
bower install pip-webui
```

or install it using **npm**:
```bash
npm install pip-webui
```

Include **pip-webui** files into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
```

Register **pipLayouts** module in angular module dependencies.
```javascript
angular.module('myApp',[..., 'pipLayouts']);
```

**Simple layout** is the simple layout type. It simply provides to content the entire screen, full width and full height 

<a href="doc/images/img-simple-layout.png" style="border: 3px ridge #c8d2df; display: block">
    <img src="doc/images/img-simple-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/simple/index.html)

**Single document layout** places content as a document with fixed width and full height centered on the screen. On tables and phones the content occupies the whole screen line it **Simple layout**.

<a href="doc/images/img-single-document-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-single-document-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/document/index.html)

**Multi-documents layout** is an extention to **Document layout** that adds a list on the left hand side to switch between documents. On phones the list occupies the entire screen and user switches between list and document back and forth.

<a href="doc/images/img-multi-document-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-multi-document-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/multi_document/index.html)

**Card layout** places small content at the center of the screen in a card. On phones the content is extended to the whole screen.

<a href="doc/images/img-card-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-card-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/card/index.html)

**Tiles layout** is used to present multiple items in tiles that arranged on the screen in one or several columns.

<a href="doc/images/img-tiles-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-tiles-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/tiles/index.html)

**Tiles groups layout** is an extension to **Tiles layout** that breaks items into groups.

<a href="doc/images/img-tiles-groups-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-tiles-groups-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/tile_groups/index.html)

**Dialog layout** places content in a modal dialog. On phones the dialog is resized to occupy the entire screen.

<a href="doc/images/img-dialog-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-dialog-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/dialog/index.html)

**Split View layout** is the most complex layout type. It can be helpful to organize complex hierarchical content. As user drills down the content, it slides to the right. Going to the top of the hierarchy slides the content to the left. To simplify navigation this content integrates with breadcrumb in **Appbar**

<a href="doc/images/img-split-view-layout.png" style="border: 3px ridge #c8d2df; margin: 0 auto; display: inline-block">
    <img src="doc/images/img-split-view-layout.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-layouts/split/index.html)



## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-layouts/issues).
